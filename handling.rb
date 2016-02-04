require 'json'

class MyExceptionHandling
  def initialize(app)
    @app = app
  end

  def call(env)
    begin
      @app.call env
    rescue Pard::Invalid => ex
      env['rack.errors'].puts ex
      env['rack.errors'].puts ex.backtrace.join("\n")
      env['rack.errors'].flush

      hash = {
        :status => :fail,
        :reason => ex.message
      }
      hash[:backtrace] = ex.backtrace if ENV['RACK_ENV'] == 'development'

      [200, {'Content-Type' => 'application/json'}, [hash.to_json]]
    end
  end
end
