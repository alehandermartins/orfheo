require 'rubygems'
require 'bundler'
Bundler.setup

require './config/config'
require './controllers/base'
require './controllers/welcome'
require './controllers/login'
require './controllers/users'
require './controllers/profiles'
require './controllers/calls'
require './controllers/search'
require './controllers/forms'


# require 'rack-livereload' if ENV['RACK_ENV'] == 'development'
# use Rack::LiveReload, no_swf: true , min_delay: 2000, max_delay: 5000 if ENV['RACK_ENV'] == 'development'
use Rack::Deflater

require './handling'
use MyExceptionHandling

use UsersController
use ProfilesController
use CallsController

map '/' do
  run WelcomeController
end

map '/login' do
  run LoginController
end

map '/search' do
	run SearchController
end

map '/forms' do
	run FormsController
end
