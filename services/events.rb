module Services
  class Events
    class << self

      def get_event event_id, user_id
        user = Repos::Users.grab({user_id: user_id})
        event = Repos::Events.get_event event_id
        event[:program] = arrange_program event, event[:program]
        whitelisted_query = (user_id == event[:user_id] || event[:whitelist].any?{|whitelisted| whitelisted[:email] == user[:email]})
        event[:whitelisted] = whitelisted_query
        event.delete(:artists)
        event.delete(:whitelist)
        event.delete(:spaces)
        event.delete(:qr)
        event
      end

      def get_event_by_slug slug, user_id
        user = Repos::Users.grab({user_id: user_id})
        event = Repos::Events.get_event_by_slug slug
        event[:program] = arrange_program event, event[:program]
        whitelisted_query = (user_id == event[:user_id] || event[:whitelist].any?{|whitelisted| whitelisted[:email] == user[:email]})
        event[:whitelisted] = whitelisted_query
        event.delete(:artists)
        event.delete(:whitelist)
        event.delete(:spaces)
        event.delete(:qr)
        event
      end

      def get_app_event event_id
        event = Repos::Events.get_event event_id
        program = arrange_program event, event[:program]
        program.map!{|performance|
          performance[:participant_category] = performance[:participant_category]
          performance[:host_category] = performance[:host_category]
          performance.delete(:participant_subcategory)
          performance.delete(:host_subcategory)
          performance.delete(:comments)
          performance.delete(:confirmed)
          performance.delete(:participant_proposal_id)
          performance.delete(:host_proposal_id)
          performance
        }

        name = event[:name]
        dates = event[:eventTime].keys
        dates.pop
        program = event[:program]
        {name: name, dates: dates, shows: program}
      end

      def get_program event_id
        event = Repos::Events.get_event event_id
        arrange_program event, event[:program]
      end

      def get_events
        events = get_all
        events.map{ |event|
          event.delete(:artists)
          event.delete(:spaces)
          event.delete(:program)
          event.delete(:whitelist)
          event.delete(:partners)
          event.delete(:qr)
          event
        }
      end

      def get_header_info user_id
        events = Repos::Events.get_user_events user_id
        events.map{ |event|
          {
            event_id: event[:event_id],
            name: event[:name],
            img: event[:img],
            color: event[:color]
          }
        }
      end

      def get_my_info profile_id
        info = {}
        proposals = {}
        events = get_all
        proposals[:artist] = my_artist_proposals(events, profile_id)
        proposals[:space] = my_space_proposals(events, profile_id)
        info[:proposals] = proposals
        info[:program] = my_program(events, profile_id)
        info[:events] = my_events(events, profile_id)
        info
      end

      private
      def get_all
        Repos::Events.get_all
      end

      def my_events events, profile_id
        events = events.select{ |event| event[:profile_id] == profile_id}
        events.map{ |event|
          event.delete(:artists)
          event.delete(:whitelist)
          event.delete(:spaces)
          event.delete(:program)
          event.delete(:partners)
          event.delete(:qr)
          event
        }
      end

      def my_artist_proposals events, profile_id
        events.map{ |event|
          event[:eventTime].delete(:permanent)
          date = event[:eventTime].keys.max.to_s
          next if Time.now > Time.parse(date) + 30 * 60* 60
          artist = event[:artists].detect{ |proposal| proposal[:profile_id] == profile_id}
          next if artist.blank?
          proposals = artist[:proposals]
          proposals.each{ |proposal|
            proposal[:event_id] = event[:event_id]
            proposal[:event_name] = event[:name]
            proposal[:call_id] = event[:call_id]
            proposal[:deadline] = event[:deadline]
            proposal[:event_color] = event[:color]
          }
        }.compact.flatten
      end

      def my_space_proposals events, profile_id
        events.map{ |event|
          event[:eventTime].delete(:permanent)
          date = event[:eventTime].keys.max.to_s
          next if Time.now > Time.parse(date) + 30 * 60* 60
          proposal = event[:spaces].detect{ |proposal| proposal[:profile_id] == profile_id}
          next if proposal.blank?
          proposal[:event_id] = event[:event_id]
          proposal[:event_name] = event[:name]
          proposal[:call_id] = event[:call_id]
          proposal[:deadline] = event[:deadline]
          proposal[:event_color] = event[:color]
          proposal
        }.compact.flatten
      end

      def my_program events, profile_id
        events.map{ |event|
          next if event[:published] == false
          event[:eventTime].delete(:permanent)
          my_performances = event[:program].select{|performance| performance[:participant_id] == profile_id || performance[:host_id] == profile_id}
          next if my_performances.blank?
          {
            event_id: event[:event_id],
            event_name: event[:name],
            date: event[:eventTime].keys.max.to_s,
            shows: arrange_program(event, my_performances)
          }
        }.compact.sort_by{|event| event[:date]}.reverse
      end

      def arrange_program event, program
        program.map{ |performance|
          artist = event[:artists].select{ |participant| participant[:profile_id] == performance[:participant_id]}.first
          artist_proposal = artist[:proposals].select{ |proposal| proposal[:proposal_id] == performance[:participant_proposal_id]}.first
          space = event[:spaces].select{ |host| host[:profile_id] == performance[:host_id]}.first
          order = event[:spaces].index{ |host| host[:profile_id] == performance[:host_id] }
          performance[:participant_id] = performance[:participant_id] + '-own' if artist[:own] == true
          performance[:host_id] = performance[:host_id] + '-own' if space[:own] == true
          performance.merge! host_name: space[:name]
          performance.merge! address: space[:address]
          performance.merge! host_category: space[:category]
          performance.merge! host_subcategory: space[:subcategory]
          performance.merge! participant_name: artist[:name]
          performance.merge! title: artist_proposal[:title] if performance[:title].blank?
          performance.merge! short_description: artist_proposal[:short_description] if performance[:short_description].blank?
          performance.merge! children: artist_proposal[:children]
          performance.merge! participant_category: artist_proposal[:category]
          performance.merge! participant_subcategory: artist_proposal[:subcategory]
          performance.merge! order: order
        }
      end
    end
  end
end
