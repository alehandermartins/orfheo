require 'sinatra/config_file'
require 'sinatra/asset_pipeline'

class BaseController < Sinatra::Base
  set :environment, (ENV['RACK_ENV'].to_sym || :production) rescue :production

  register Sinatra::ConfigFile

  config_file File.join(File.dirname(__FILE__) , 'config.yml')

  set root: File.join(File.dirname(__FILE__), '..')

  set :assets_precompile, %w(
    vendor.css
    vendor.js
    ours.css
    ours.js
    jquery.js
    wait.svg
    cabinsketch_regular.ttf
    cabinsketch_bold.ttf
    glyphicons-halflings-regular.eot
    glyphicons-halflings-regular.svg
    glyphicons-halflings-regular.ttf
    glyphicons-halflings-regular.woff
    og.png
    icon.png
  )

  set :assets_prefix, %w(assets vendor/assets)
  set :assets_css_compressor, :sass
  set :assets_js_compressor, :uglifier

  register Sinatra::AssetPipeline

  configure do
    enable :sessions
  end

  # configure :development, :test do
  #   DB = Mongo::Connection.new
  #   @@db = DB[settings.dbname]
  #   puts 'configured for dt'
  #   Sprockets::Helpers.configure do |config|
  #     config.debug = true
  #   end
  # end

  # # :nocov:
  # configure :production, :deployment do
  #   DB = Mongo::Connection.new settings.dbhost, settings.dbport
  #   DB[settings.dbname].authenticate settings.dbuser, settings.dbpass
  #   @@db = DB[settings.dbname]
  #   puts 'configured for pdd'
  # end
  # # :nocov:

  # configure do
  #   Repos::Games.for @@db
  #   Repos::Players.for @@db
  #   Repos::Actions.for @@db
  # end

  configure do
    set :dump_errors, false
    set :raise_errors, true
    set :show_exceptions, false
  end
end
