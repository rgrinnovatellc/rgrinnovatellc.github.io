require 'json'
require 'net/http'
require 'uri'
require 'cgi'
require 'fileutils'

module Jekyll
  class LiveEditor < Jekyll::Generator
    safe true
    priority :high

    def generate(site)
      @site = site
      add_live_editor_assets(site)
      add_edit_buttons_to_pages(site)
      create_api_endpoints(site)
      initialize_github_api(site)
    end

    private

    def add_live_editor_assets(site)
      # Add CSS for the live editor
      site.static_files << Jekyll::StaticFile.new(site, site.source, 'assets', 'live-editor.css')
      
      # Add JavaScript for the live editor
      site.static_files << Jekyll::StaticFile.new(site, site.source, 'assets', 'live-editor.js')
    end

    def add_edit_buttons_to_pages(site)
      site.pages.each do |page|
        next unless page.data['layout'] && page.data['layout'] != 'default'
        
        # Add edit button data to page
        page.data['show_edit_button'] = true
        page.data['edit_password'] = '984904'
        page.data['github_repo'] = 'upgautamvt/upgautamvt.github.io'
        page.data['file_path'] = page.path
      end
    end

    def create_api_endpoints(site)
      # Create API endpoint for fetching page content
      site.pages << ApiPage.new(site, site.source, 'api/content')
      site.pages << ApiPage.new(site, site.source, 'api/update')
    end

    def initialize_github_api(site)
      # Initialize GitHub API if token is available
      github_token = ENV['GITHUB_TOKEN'] || site.config['github_token']
      
      if github_token
        require_relative 'github_api'
        site.config['github_api'] = Jekyll::GitHubAPI.new(github_token)
        puts "GitHub API initialized with token"
      else
        puts "Warning: GITHUB_TOKEN not set. Live editor will use simulation mode."
        site.config['github_api'] = nil
      end
    end
  end

  class ApiPage < Jekyll::Page
    def initialize(site, base, endpoint)
      @site = site
      @base = base
      @endpoint = endpoint
      
      case endpoint
      when 'api/content'
        @dir = 'api'
        @name = 'content.html'
        self.data = {
          'layout' => 'api',
          'title' => 'Content API',
          'permalink' => '/api/content/'
        }
      when 'api/update'
        @dir = 'api'
        @name = 'update.html'
        self.data = {
          'layout' => 'api',
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

  class EditPageGenerator < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      site.pages << EditPage.new(site, site.source)
    end
  end

  class EditPage < Jekyll::Page
    def initialize(site, base)
      @site = site
      @base = base
      @dir = 'edit'
      @name = 'index.html'

      self.process(@name)
      self.data = {
        'layout' => 'default',
        'title' => 'Live Editor',
        'permalink' => '/edit/'
      }
    end

    def read_yaml(header, content)
      self.content = content
      self.data = self.data.merge(header)
    end
  end
end 