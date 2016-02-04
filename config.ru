require 'rubygems'
require 'bundler'
Bundler.setup

require './config/config'
require './controllers/base'
require './controllers/welcome'
require './controllers/users'

# require 'rack-livereload' if ENV['RACK_ENV'] == 'development'
# use Rack::LiveReload, no_swf: true , min_delay: 2000, max_delay: 5000 if ENV['RACK_ENV'] == 'development'
use Rack::Deflater

require './handling'
use MyExceptionHandling

map '/' do
  run WelcomeController
end

map '/users' do
  run UsersController
end
