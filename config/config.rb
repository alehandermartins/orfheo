require 'sinatra/config_file'
require 'sinatra/asset_pipeline'
require 'mail'
require 'mongo'

require_relative '../services/mails'
require_relative '../services/users'

require_relative '../repos/users'

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

  options = {
    :address => 'smtp.gmail.com',
    :port => 587,
    :domain => 'localhost',
    :user_name => 'pard.project@gmail.com',
    :password => 'le0pard0',
    :authentication => 'plain',
    :enable_starttls_auto => true
  }

  configure :development, :test do
    DB = Mongo::Connection.new
    @@db = DB[settings.dbname]
    Mail.defaults do
      delivery_method :test
    end
    puts 'configured for dt'
  end

  configure do
    set :dump_errors, false
    set :raise_errors, true
    set :show_exceptions, false
  end
end
