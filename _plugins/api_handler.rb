require 'json'
require 'net/http'
require 'uri'
require 'base64'

module Jekyll
  class APIHandler < Jekyll::Generator
    safe true
    priority :high

    def generate(site)
      @site = site
      setup_api_endpoints
    end

    private

    def setup_api_endpoints
      # Create API endpoint pages
      @site.pages << APIEndpoint.new(@site, @site.source, 'api/update')
    end
  end

  class APIEndpoint < Jekyll::Page
    def initialize(site, base, endpoint)
      @site = site
      @base = base
      @endpoint = endpoint
      
      case endpoint
      when 'api/update'
        @dir = 'api'
        @name = 'update.html'
        self.data = {
          'layout' => 'api_update',
          'title' => 'Update API',
          'permalink' => '/api/update/'
        }
      end
      
      self.process(@name)
    end

    def read_yaml(header, content)
      self.content = content
      self.data = self.data.merge(header)
    end
  end
end 