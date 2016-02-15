module Services
  class Calls
    class << self

      def register call, user_id
        call.merge! user_id: user_id
        call.merge! call_id: SecureRandom.uuid
        Repos::Calls.add call
      end
    end
  end
end
