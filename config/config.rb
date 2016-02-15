require 'sinatra/config_file'
require 'sinatra/asset_pipeline'
require 'uuid'
require 'pony'
require 'mongo'
require 'cloudinary'

require_relative '../exceptions'

require_relative '../services/mails'
require_relative '../services/users'
require_relative '../services/profiles/artist_profile'
require_relative '../services/profiles/space_profile'
require_relative '../services/profiles'
require_relative '../services/calls'

require_relative '../repos/users'
require_relative '../repos/profiles'
require_relative '../repos/calls'

class BaseController < Sinatra::Base
  set :environment, (ENV['RACK_ENV'].to_sym || :production) rescue :production

  register Sinatra::ConfigFile

  config_file File.join(File.dirname(__FILE__) , 'config.yml')

  set root: File.join(File.dirname(__FILE__), '..')

  set :assets_precompile, %w(
    ours.css
    ours.js
    jquery.js
  )

  set :assets_prefix, %w(assets vendor/assets)
  set :assets_css_compressor, :sass
  set :assets_js_compressor, :uglifier


  register Sinatra::AssetPipeline

  configure do
    enable :sessions
  end

  options = {
    :from => 'pard.project@gmail.com',
    :headers => { 'Content-Type' => 'text/html' },
    :via => :smtp,
    :via_options => {
      :address => 'smtp.sendgrid.net',
      :port => '587',
      :domain => 'heroku.com',
      :user_name => ENV['SENDGRID_USERNAME'],
      :password => ENV['SENDGRID_PASSWORD'],
      :authentication => :plain,
      :enable_starttls_auto => true
    }
  }

  configure :development, :test do
    DB = Mongo::Connection.new
    @@db = DB[settings.dbname]
    Pony.override_options = {:from => 'pard.project@gmail.com', :via => :test }
    Cloudinary.config do |config|
      config.cloud_name = 'dtet8jax5'
      config.api_key = '613355472667488'
      config.api_secret = 'JMI6dnwZNOjH1vPJN-hyrMY8xZA'
      config.cdn_subdomain = true
      CLOUDINARY_URL = 'cloudinary://613355472667488:JMI6dnwZNOjH1vPJN-hyrMY8xZA@dtet8jax5'
    end
    puts 'configured for dt'
  end

  configure :production, :deployment do
    DB = Mongo::Connection.new settings.dbhost, settings.dbport
    DB[settings.dbname].authenticate settings.dbuser, settings.dbpass
    @@db = DB[settings.dbname]
    Pony.override_options = options
    puts 'configured for pdd'
  end

  configure do
    Repos::Users.for @@db
    Repos::Profiles.for @@db
    Repos::Calls.for @@db
  end

  configure do
    set :dump_errors, false
    set :raise_errors, true
    set :show_exceptions, false
  end
end
