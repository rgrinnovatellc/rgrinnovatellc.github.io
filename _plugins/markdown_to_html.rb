# _plugins/direct_markdown_processor.rb
module Jekyll
  class DirectMarkdownProcessor < Generator
    safe true
    priority :high  # Process before default content conversion

    def generate(site)
      input_dir = File.join(site.source, '_posts', 'direct_markdown')
      output_dir = File.join(site.source, '_includes', 'blogs_html')
      FileUtils.mkdir_p(output_dir)

      # Process only direct_markdown posts
      site.posts.docs.each do |post|
        next unless post.path.include?('_posts/direct_markdown/')

        # Convert Markdown content to HTML
        converter = site.find_converter_instance(Jekyll::Converters::Markdown)
        html_content = converter.convert(post.content)

        # Save HTML to includes
        html_filename = File.basename(post.name, '.*') + '.html'
        File.write(File.join(output_dir, html_filename), html_content)

        # Replace original content with include tag
        post.content = "{% include blogs_html/#{html_filename} %}"
      end
    end
  end
end