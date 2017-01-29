module Repos
  class Events
    class << self

      def for db
        @@events_collection = db['events']
      end

      def exists? event_id
        return false unless UUID.validate(event_id)
        @@events_collection.count(event_id: event_id) > 0
      end

      def proposal_exists? proposal_id
        @@events_collection.count({"$or": [{"artists.proposals.proposal_id": proposal_id},{"spaces.proposal_id": proposal_id}]}) > 0
      end

      def add_artist event_id, artist
        if @@events_collection.count(event_id: event_id, "artists.profile_id": artist[:profile_id]) == 0
          @@events_collection.update_one({event_id: event_id},{
            "$push": {artists: artist}
          })
        else
          @@events_collection.update_one({event_id: event_id, "artists.profile_id": artist[:profile_id]},
          {
            "$push": {"artists.$.proposals": artist[:proposals].first}
          },
          {upsert: true})
        end
      end

      def add_space event_id, space
        return if @@events_collection.count(event_id: event_id, "spaces.profile_id": space[:profile_id]) > 0
        @@events_collection.update_one({event_id: event_id},{
          "$push": {spaces: space}
        })
      end

      def modify_artist artist
        event = grab({"artists.proposals.proposal_id": artist[:proposals].first[:proposal_id]}).first
        proposals = event[:artists].detect{|event_artist| event_artist[:profile_id] == artist[:profile_id]}[:proposals]
        modified_proposals = proposals.map{ |proposal|
          proposal = artist[:proposals].first if proposal[:proposal_id] == artist[:proposals].first[:proposal_id]
          proposal
        }
        @@events_collection.update_one({"artists.proposals.proposal_id": artist[:proposals].first[:proposal_id]},
          {
            "$set": {'artists.$.name': artist[:name], 'artists.$.address': artist[:address], 'artists.$.phone': artist[:phone], 'artists.$.email': artist[:email], 'artists.$.proposals': modified_proposals}
          })
      end

      def modify_space space
        proposal_id = space[:proposal_id]
        @@events_collection.update_one({ "spaces.proposal_id": proposal_id },
          {
            "$set": {"spaces.$": space}
          })
      end

      def update_artist artist
        profile_id = artist[:profile_id]
        @@events_collection.update_many({"artists.profile_id": profile_id},
          {
            "$set": {'artists.$.name': artist[:name], 'artists.$.address': artist[:address]}
          })
      end

      def update_space space
        profile_id = space[:profile_id]
        @@events_collection.update_many({"spaces.profile_id": profile_id},
          {
            "$set": {'spaces.$.name': space[:name], 'spaces.$.address': space[:address], 'spaces.$.category': space[:category], 'spaces.$.description': space[:description]}
          })
      end

      def delete_space_proposal proposal_id
        delete_performances proposal_id
        @@events_collection.update_one({"spaces.proposal_id": proposal_id},
          {
            "$pull": {'spaces': {'proposal_id' => proposal_id}}
          })
      end

      def delete_artist_proposal proposal_id
        delete_performances proposal_id
        event = grab({"artists.proposals.proposal_id": proposal_id}).first
        artist = event[:artists].detect{|artist| artist[:proposals].any?{ |proposal| proposal[:proposal_id] == proposal_id}}
        proposals = artist[:proposals]
        proposals.select!{|proposal| proposal[:proposal_id] != proposal_id}
        return delete_artist(event[:event_id], artist[:profile_id]) if proposals.blank?
        @@events_collection.update_one({"artists.proposals.proposal_id": proposal_id},
          {
            "$set": {'artists.$.proposals': proposals}
          })
      end

      def delete_artist event_id, profile_id
        @@events_collection.update_one({event_id: event_id},
          {
            "$pull": {'artists': {'profile_id' => profile_id}}
          })
      end

      def delete_artist_profile profile_id
        events = grab({"artists.profile_id": profile_id})
        events.each{ |event|
          artist = event[:artists].detect{|artist| artist[:profile_id] == profile_id}
          proposals = artist[:proposals]
          modified_proposals = proposals.map {|proposal|
            proposal[:own] = true
            proposal
          }
          @@events_collection.update_one({event_id: event[:event_id], 'artists.profile_id': profile_id},
          {
            "$set": {'artists.$.own': 'true', 'artists.$.proposals': modified_proposals}
          })
        }
      end

      def delete_space_profile profile_id
        events = grab({"spaces.profile_id": profile_id})
        events.each{ |event|
          space = event[:spaces].detect{|space| space[:profile_id] == profile_id}
          @@events_collection.update_one({event_id: event[:event_id], 'spaces.profile_id': profile_id},
          {
            "$set": {'spaces.$.own': 'true'}
          })
        }
      end

      def save_program event_id, program
        @@events_collection.update_one({event_id: event_id},{
          "$set": {program: program}
        })
      end

      def delete_performances proposal_id
        @@events_collection.update_one({"$or": [{"artists.proposals.proposal_id": proposal_id},{"spaces.proposal_id": proposal_id}]},
          {
            "$pull": {'program': {"$or": [{'participant_proposal_id'=> proposal_id}, {'host_proposal_id'=> proposal_id}]}}
          }
        )
      end

      def space_order event_id, order
        event = grab({event_id: event_id}).first
        event[:spaces].each{|space| order.push(space[:profile_id]) unless order.include? space[:profile_id]}
        spaces = event[:spaces].sort_by{|space| order.index(space[:profile_id])}
        @@events_collection.update_one({event_id: event_id},{
          "$set": {spaces: spaces}
        })
      end

      def add_whitelist event_id, whitelist
        @@events_collection.update_one({event_id: event_id},{
          "$set": {whitelist: whitelist}
        })
      end

      def publish event_id
        event = grab({event_id: event_id}).first
        if event[:published] == 'false'
          event[:published] = 'true'
        else 
          event[:published] = 'false'
        end
        @@events_collection.update_one({event_id: event_id},{
          "$set": {published: event[:published]}
        })
        event[:published]
      end

      def get_event event_id
        grab({event_id: event_id}).first
      end

      def get_event_owner event_id
        event = grab({event_id: event_id}).first
        event[:user_id]
      end

      def get_arranged_event event_id
        event = grab({event_id: event_id}).first
        event[:program] = arrange_program event, event[:program]
        event
      end

      def get_events
        grab({}).map{ |event|
          event[:program] = arrange_program event, event[:program]
          event.delete(:artists)
          event.delete(:whitelist)
          event.delete(:spaces)
          event.delete(:partners)
          event.delete(:qr)
          event
        }
      end

      def get_artist_proposal proposal_id
        event = grab({"artists.proposals.proposal_id": proposal_id}).first
        artist = event[:artists].detect{|artist| artist[:proposals].any?{ |proposal| proposal[:proposal_id] == proposal_id}}
        proposal = artist[:proposals].detect{ |proposal| proposal[:proposal_id] == proposal_id}
        artist.delete(:proposals)
        artist.merge proposal
      end

      def get_space_proposal proposal_id
        event = grab({'spaces.proposal_id': proposal_id}).first
        event[:spaces].detect{|space| space[:proposal_id] == proposal_id}
      end

      def get_program event_id
        event = grab({event_id: event_id}).first
        arrange_program event, event[:program]
      end

      def get_header_info user_id
        grab({user_id: user_id}).map{ |event|
          {
            event_id: event[:event_id],
            name: event[:name],
            img: event[:img],
            color: event[:color]
          }
        }
      end

      def my_info profile_id, type
        info = {}
        events = grab({})
        info[:proposals] = my_artist_proposals(events, profile_id) if type == 'artist'
        info[:proposals] = my_space_proposals(events, profile_id) if type == 'space'
        info[:program] = my_program(events, profile_id)
        info[:events] = my_events(events, profile_id)
        info
      end

      private
      def grab query, projection = {}
        results = @@events_collection.find(query) if projection.blank?
        results = @@events_collection.aggregate([{'$match': query}, {'$project': projection}]) unless projection.blank?
        return [] unless results.count > 0

        results.map { |event|
         Util.string_keyed_hash_to_symbolized event
        }
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
          artist = event[:artists].detect{ |proposal| proposal[:profile_id] == profile_id}
          next if artist.blank?
          proposals = artist[:proposals]
          proposals.each{ |proposal|
            proposal[:event_id] = event[:event_id]
            proposal[:event_name] = event[:name]
            proposal[:call_id] = event[:call_id]
            proposal[:deadline] = event[:deadline]
          }
        }.compact.flatten
      end

      def my_space_proposals events, profile_id
        events.map{ |event|
          proposal = event[:spaces].detect{ |proposal| proposal[:profile_id] == profile_id}
          next if proposal.blank?
          proposal[:event_id] = event[:event_id]
          proposal[:event_name] = event[:name]
          proposal[:call_id] = event[:call_id]
          proposal[:deadline] = event[:deadline]
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
          performance.merge! title: artist_proposal[:title]
          performance.merge! short_description: artist_proposal[:short_description]
          performance.merge! children: artist_proposal[:children]
          performance.merge! participant_category: artist_proposal[:category]
          performance.merge! participant_subcategory: artist_proposal[:subcategory]
          performance.merge! order: order
        }
      end
    end
  end
end
