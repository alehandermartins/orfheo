module Services
  class Calls
    class << self

      def register call, user_id
        call.merge! user_id: user_id
        call.merge! call_id: 'b5bc4203-9379-4de0-856a-55e1e5f3fac6'
        Repos::Calls.add call
      end

      def exists? call_id
        Repos::Calls.exists?({call_id: call_id})
      end
    end
  end
end
