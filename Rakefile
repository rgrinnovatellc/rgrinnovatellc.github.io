require "rubygems"
require "socket"

require "bundler/setup"
require "jekyll"

ENV["JEKYLL_ENV"] = "production"

def port_available?(port)
  TCPServer.new("127.0.0.1", port).close
  true
rescue Errno::EADDRINUSE, Errno::EACCES
  false
end

def find_available_port(start_port, attempts = 20)
  attempts.times do |offset|
    port = start_port + offset
    return port if port_available?(port)
  end

  raise "No free port found starting at #{start_port}"
end

desc "Serve the site on the first available local port"
task :serve do
  requested_port = ENV.fetch("PORT", "4000").to_i
  port = find_available_port(requested_port)
  ENV["JEKYLL_ENV"] = "development"

  puts "Starting Jekyll at http://127.0.0.1:#{port}"
  puts "Port #{requested_port} is unavailable, using #{port} instead" if port != requested_port

  exec "bundle", "exec", "jekyll", "serve", "--trace", "--host", "127.0.0.1", "--port", port.to_s
end

task :preview => :serve
