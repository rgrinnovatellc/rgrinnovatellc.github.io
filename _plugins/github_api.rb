require 'net/http'
require 'json'
require 'uri'
require 'base64'

module Jekyll
  class GitHubAPI
    def initialize(token = nil, repo = nil)
      @token = token || ENV['GITHUB_TOKEN']
      @repo = repo || 'upgautamvt/upgautamvt.github.io'
      @api_base = 'https://api.github.com'
    end

    def create_pull_request(file_path, content, commit_message = nil)
      begin
        # Create a new branch
        branch_name = "live-edit-#{Time.now.to_i}"
        create_branch(branch_name)
        
        # Update the file in the new branch
        update_file(file_path, content, branch_name, commit_message)
        
        # Create pull request
        create_pr(branch_name, file_path)
        
        return {
          success: true,
          branch: branch_name,
          message: "Pull request created successfully"
        }
      rescue => e
        return {
          success: false,
          error: e.message,
          message: "Failed to create pull request"
        }
      end
    end

    private

    def create_branch(branch_name)
      # Get the latest commit SHA from main branch
      main_sha = get_main_branch_sha
      
      # Create new branch
      url = "#{@api_base}/repos/#{@repo}/git/refs"
      data = {
        ref: "refs/heads/#{branch_name}",
        sha: main_sha
      }
      
      response = make_request(url, 'POST', data)
      
      unless response.code == '201'
        raise "Failed to create branch: #{response.body}"
      end
      
      response
    end

    def update_file(file_path, content, branch_name, commit_message = nil)
      # Get current file content and SHA
      file_info = get_file_info(file_path, branch_name)
      
      # Prepare commit message
      commit_message ||= "Live edit: Update #{file_path}"
      
      # Update file
      url = "#{@api_base}/repos/#{@repo}/contents/#{file_path}"
      data = {
        message: commit_message,
        content: Base64.strict_encode64(content),
        branch: branch_name,
        sha: file_info[:sha]
      }
      
      response = make_request(url, 'PUT', data)
      
      unless response.code == '200' || response.code == '201'
        raise "Failed to update file: #{response.body}"
      end
      
      response
    end

    def create_pr(branch_name, file_path)
      url = "#{@api_base}/repos/#{@repo}/pulls"
      data = {
        title: "Live Edit: Update #{file_path}",
        body: generate_pr_body(file_path, branch_name),
        head: branch_name,
        base: "main"
      }
      
      response = make_request(url, 'POST', data)
      
      unless response.code == '201'
        raise "Failed to create pull request: #{response.body}"
      end
      
      JSON.parse(response.body)
    end

    def get_main_branch_sha
      url = "#{@api_base}/repos/#{@repo}/git/ref/heads/main"
      response = make_request(url, 'GET')
      
      unless response.code == '200'
        raise "Failed to get main branch SHA: #{response.body}"
      end
      
      JSON.parse(response.body)['object']['sha']
    end

    def get_file_info(file_path, branch_name)
      url = "#{@api_base}/repos/#{@repo}/contents/#{file_path}?ref=#{branch_name}"
      response = make_request(url, 'GET')
      
      if response.code == '404'
        # File doesn't exist, return nil SHA
        return { sha: nil }
      elsif response.code == '200'
        data = JSON.parse(response.body)
        return { sha: data['sha'] }
      else
        raise "Failed to get file info: #{response.body}"
      end
    end

    def generate_pr_body(file_path, branch_name)
      <<~BODY
        ## 🔄 Live Edit Pull Request

        **File Updated:** `#{file_path}`
        **Branch:** `#{branch_name}`
        **Timestamp:** #{Time.now.strftime('%Y-%m-%d %H:%M:%S UTC')}

        ### Changes Summary
        - Content modified via live editor interface
        - Password-protected editing session
        - Automated branch creation and file update
        - Pull request created for review

        ### Review Instructions
        1. **Review the changes** in the diff below
        2. **Test the site locally** if needed
        3. **Check for any syntax errors** in the modified file
        4. **Approve and merge** if changes look good

        ### File Details
        - **Path:** `#{file_path}`
        - **Branch:** `#{branch_name}`
        - **Base Branch:** `main`
        - **Edit Method:** Live Editor (Password Protected)

        ### Security Notes
        - Changes were made through the password-protected live editor
        - All modifications are tracked in this pull request
        - No direct commits to main branch

        ---
        *This pull request was automatically created by the Live Editor system.*
      BODY
    end

    def make_request(url, method, data = nil)
      uri = URI(url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      
      request = case method
                when 'GET'
                  Net::HTTP::Get.new(uri)
                when 'POST'
                  Net::HTTP::Post.new(uri)
                when 'PUT'
                  Net::HTTP::Put.new(uri)
                when 'DELETE'
                  Net::HTTP::Delete.new(uri)
                end
      
      request['Authorization'] = "token #{@token}"
      request['Accept'] = 'application/vnd.github.v3+json'
      request['Content-Type'] = 'application/json'
      
      if data
        request.body = data.to_json
      end
      
      http.request(request)
    end
  end
end 