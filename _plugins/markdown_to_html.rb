# _plugins/markdown_to_html_generator.rb
module Jekyll
  class DirectMarkdownHtmlGenerator < Generator
    safe true
    priority :low

    def generate(site)
      # Configure input/output paths
      input_dir = File.join(site.source, '_posts', 'direct_markdown')
      output_dir = File.join(site.source, '_includes', 'blogs_html')

      # Create output directory if missing
      FileUtils.mkdir_p(output_dir)

      # Process only files in _posts/direct_markdown
      Dir.glob(File.join(input_dir, '*.md')).each do |md_path|
        # Read Markdown content
        content = File.read(md_path)

        # Extract content WITHOUT front matter
        markdown_content = content.split(/---\s*/m).last.strip

        # Convert to HTML
        html_content = site.find_converter_instance(
          Jekyll::Converters::Markdown
        ).convert(markdown_content)

        # Generate output filename
        filename = File.basename(md_path, '.md') + '.html'
        output_path = File.join(output_dir, filename)

        # Write HTML file
        File.write(output_path, html_content)
      end
    end
  end
end