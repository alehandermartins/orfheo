require 'rubygems'
require 'bundler'
Bundler.setup

require './config/config'
require './controllers/welcome'

# require 'rack-livereload' if ENV['RACK_ENV'] == 'development'
# use Rack::LiveReload, no_swf: true , min_delay: 2000, max_delay: 5000 if ENV['RACK_ENV'] == 'development'
use Rack::Deflater

map '/' do
  run WelcomeController
end
