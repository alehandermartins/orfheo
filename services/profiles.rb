module Services
  class Profiles
    class << self

      def create profile, user_id
        profile.merge! user_id: user_id
        Repos::Profiles.add profile
      end
    end
  end
end
