require 'sinatra/config_file'
require 'sinatra/asset_pipeline'
require 'uuid'
require 'pony'
require 'mongo'
require 'cloudinary'
require 'active_support'
require 'active_support/core_ext/object'

require_relative '../exceptions'

require_relative '../services/mails'
require_relative '../services/users'
require_relative '../services/profiles'
require_relative '../services/calls'

require_relative '../repos/users'
require_relative '../repos/profiles'
require_relative '../repos/calls'

require_relative '../lib/users/user'
require_relative '../lib/profiles/artist_profile'
require_relative '../lib/profiles/space_profile'
require_relative '../lib/calls/call'
require_relative '../lib/calls/proposal'
require_relative '../lib/util'

class BaseController < Sinatra::Base
  set :environment, (ENV['RACK_ENV'].to_sym || :production) rescue :production

  register Sinatra::ConfigFile

  config_file File.join(File.dirname(__FILE__) , 'config.yml')

  set root: File.join(File.dirname(__FILE__), '..')

  set :assets_precompile, %w(
    ours.css
    ours.js
    jquery.js
    italian_flag.jpeg
    valencian_flag.png
    english_flag.png
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
      config.cloud_name = 'hxgvncv7u'
      config.api_key = '844974134959653'
      config.api_secret = '2scRx2fF3Vuw1qS6tu0FGli69Po'
      config.cdn_subdomain = true
      CLOUDINARY_URL = 'cloudinary://844974134959653:2scRx2fF3Vuw1qS6tu0FGli69Po@hxgvncv7u'
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
