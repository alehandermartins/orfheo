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
    :via => :smtp,
    :via_options => {
      :address => 'smtp.sendgrid.net',
      :port => '587',
      :domain => 'heroku.com',
      :user_name => 'app47085092@heroku.com',
      :password => 'a9awf3mj5410',
      :authentication => :plain,
      :enable_starttls_auto => true
    }
  }

  configure :development, :test do
    DB = Mongo::Connection.new
    @@db = DB[settings.dbname]
    Pony.override_options = {:from => 'pard.project@gmail.com', :via => :test }
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
  end

  configure do
    set :dump_errors, false
    set :raise_errors, true
    set :show_exceptions, false
  end
end
