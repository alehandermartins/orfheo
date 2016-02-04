require 'sinatra/config_file'
require 'sinatra/asset_pipeline'
require 'pony'
require 'mongo'

require_relative '../exceptions'

require_relative '../services/mails'
require_relative '../services/users'

require_relative '../repos/users'

class BaseController < Sinatra::Base
  set :environment, (ENV['RACK_ENV'].to_sym || :production) rescue :production

  register Sinatra::ConfigFile

  config_file File.join(File.dirname(__FILE__) , 'config.yml')

  set root: File.join(File.dirname(__FILE__), '..')

  set :assets_precompile, %w(
    vendor.css
    ours.css
    vendor.js
    ours.js
    jquery.js
  )

  set :assets_prefix, %w(assets vendor/assets)
  set :assets_css_compressor, :sass
  set :assets_js_compressor, :uglifier

  register Sinatra::AssetPipeline

  configure :development, :test do
    DB = Mongo::Connection.new
    @@db = DB[settings.dbname]
    Pony.override_options = { :via => :test }

    puts 'configured for dt'
  end

  configure :production, :deployment do
    DB = Mongo::Connection.new settings.dbhost, settings.dbport
    DB[settings.dbname].authenticate settings.dbuser, settings.dbpass
    @@db = DB[settings.dbname]
    puts 'configured for pdd'
  end

  configure do
    Repos::Users.for @@db
  end

  configure do
    set :dump_errors, false
    set :raise_errors, true
    set :show_exceptions, false
  end
end
