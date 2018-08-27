# Require any additional compass plugins here.
require 'bootstrap-sass'
require 'font-awesome-sass'
require 'sassy-math'


# Set this to the root of your project when deployed:
http_path 			= "/Applications/MAMP/htdocs/Dev_ME/templates/marked/"
css_dir 			= "/Applications/MAMP/htdocs/Dev_ME/templates/marked/css"
sass_dir 			= "_/components/sass"
images_dir 			= "/Applications/MAMP/htdocs/Dev_ME/templates/marked/img"
javascripts_dir 	= "/Applications/MAMP/htdocs/Dev_ME/templates/marked/js"
fonts_path 			= "/Applications/MAMP/htdocs/Dev_ME/templates/marked/fonts"


# A custom module that adds a timestamp
# insert: #{timestamp()}
module Sass::Script::Functions
    def timestamp()
        return Sass::Script::String.new(Time.now.to_s)
    end
end


output_style = :expanded

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed



# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
