require 'sinatra/config_file'
require 'sinatra/asset_pipeline'
require 'uuid'
require 'pony'
require 'mongo'
require 'cloudinary'
require 'active_support'
require 'active_support/core_ext/object'
require 'time'
require 'net/http'
require 'faye/websocket'

require_relative '../exceptions'

require_relative '../services/mails'
require_relative '../services/users'
require_relative '../services/profiles'
require_relative '../services/search'

require_relative '../repos/users'
require_relative '../repos/profiles'
require_relative '../repos/calls'
require_relative '../repos/events'

require_relative '../lib/profiles/artistprofile'
require_relative '../lib/profiles/spaceprofile'
require_relative '../lib/profiles/organizationprofile'
require_relative '../lib/profiles/production'
require_relative '../lib/calls/artistproposal'
require_relative '../lib/calls/spaceproposal'
require_relative '../lib/calls/artistownproposal'
require_relative '../lib/calls/spaceownproposal'
require_relative '../lib/events/performances'
require_relative '../lib/events/whitelist'

require_relative '../lib/users/user'
require_relative '../lib/util'

Faye::WebSocket.load_adapter('thin')
class BaseController < Sinatra::Base
  set :environment, (ENV['RACK_ENV'].to_sym || :production) rescue :production
  set server: 'thin', connections: []

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
    logo_favicon.ico
    logo_black_m.png
    logo_white_m.png
    lettering_black_xxl.png
    lettering_white_m.png
    lettering_white_s.png
    logo_black_xl.png
    orfheo_fb_preview.jpg
    sort_both.png
    sort_asc.png
    sort_desc.png
    multiple-select.png
    icona_home_1.png
    icona_home_2.png
    icona_home_3.png
  )

  set :assets_prefix, %w(assets vendor/assets)
  set :assets_css_compressor, :sass
  set :assets_js_compressor, :uglifier


  register Sinatra::AssetPipeline

  configure do
    use Rack::Session::Cookie, {
      :key => 'rack.session',
      :secret => 'my_secret_cookie_session'
    }
  end

  options = {
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

  # options = {
  #   :headers => { 'Content-Type' => 'text/html' },
  #   :via => :smtp,
  #   :via_options => {
  #     :address => 'smtp.sendgrid.net',
  #     :port => '587',
  #     :domain => 'heroku.com',
  #     :user_name => 'app47085092@heroku.com',
  #     :password => 'a9awf3mj5410',
  #     :authentication => :plain,
  #     :enable_starttls_auto => true
  #   }
  # }

  Mongo::Logger.logger.level = ::Logger::FATAL

  configure :development, :test do
    @@db = Mongo::Client.new('mongodb://localhost:27017/Orfheo/cg_dev')
    Pony.override_options = {:via => :test}
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
    @@db = Mongo::Client.new('mongodb://heroku_1qqrwjjv:6j1mh19jfgfn4up520imdbh3g8@ds055535.mongolab.com:55535/heroku_1qqrwjjv')
    Pony.override_options = options
    Cloudinary.config do |config|
      config.cloud_name = 'hxgvncv7u'
      config.api_key = '844974134959653'
      config.api_secret = '2scRx2fF3Vuw1qS6tu0FGli69Po'
      config.cdn_subdomain = true
      CLOUDINARY_URL = 'cloudinary://844974134959653:2scRx2fF3Vuw1qS6tu0FGli69Po@hxgvncv7u'
    end
    puts 'configured for pdd'
  end

  configure do
    Repos::Users.for @@db
    Repos::Profiles.for @@db
    Repos::Events.for @@db
    Repos::Calls.for @@db
  end

  configure do
    set :dump_errors, false
    set :raise_errors, true
    set :show_exceptions, false
  end
end
