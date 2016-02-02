require 'sinatra/config_file'
require 'sinatra/asset_pipeline'
require 'mongo'
require 'mail'

require_relative '../services/mails'

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

  # before '/secure/*' do
  #   if !session[:identity] then
  #     session[:previous_url] = request.path
  #     @error = 'Sorry guacamole, you need to be logged in to visit ' + request.path
  #     halt erb(:welcome)
  #   end
  # end

  configure :development, :test do
    DB = Mongo::Connection.new
    @@db = DB[settings.dbname]
    Mail.defaults do
      delivery_method :test
    end
    puts 'configured for dt'
    Sprockets::Helpers.configure do |config|
      config.debug = true
    end
  end

  # :nocov:
  configure :production, :deployment do
    DB = Mongo::Connection.new settings.dbhost, settings.dbport
    DB[settings.dbname].authenticate settings.dbuser, settings.dbpass
    @@db = DB[settings.dbname]
    puts 'configured for pdd'
  end
  # :nocov:

  configure do
    set :dump_errors, false
    set :raise_errors, true
    set :show_exceptions, false
  end
end
