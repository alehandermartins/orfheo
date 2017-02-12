module Repos
  class Events
    class << self

      def for db
        @@events_collection = db['events']
        events = Repos::Events.get_all
        profiles = Repos::Profiles.get_all
        profiles.each{ |profile|
          next if profile[:phone].is_a? Hash
          profile[:phone] = { value: nil, visible: false}
          unless profile[:productions].blank?
            productions = profile[:productions].map{ |production|
              next production if production[:cache].is_a? Hash
              production[:cache] = { value: nil, visible: false}
              production[:children] = 'all_public'
              production
            }
            profile[:productions] = productions
          end
          Repos::Profiles.update profile
        }

        events.each{ |event|
          artists = event[:artists].map{ |artist|
            prof = profiles.detect{|profile| profile[:profile_id] == artist[:profile_id]}
            next artist if artist[:phone].is_a? Hash
            phone = { value: artist[:phone], visible: false}
            artist[:phone] = phone
            artist[:proposals].each{|proposal|
              children = 'all_public'
              children = 'baby' if proposal[:'1'] == 'Infantil'
              children = 'family' if proposal[:'1'] == 'Familiar'
              children = 'young' if proposal[:'1'] == 'Juvenil'
              children = 'adults' if proposal[:'1'] == 'Adultos'
              proposal[:children] = children
              proposal.delete(:'1')
              if ['music', 'arts', 'poetry'].include?(proposal[:category])
                proposal[:cache] = { value: proposal[:'7'], visible: false}
                proposal.delete(:'7')
              end
              if ['workshop', 'gastronomy'].include?(proposal[:category])
                proposal[:cache] = { value: proposal[:'10'], visible: false}
                proposal.delete(:'10')
              end
              if ['street_art', 'audiovisual'].include?(proposal[:category])
                proposal[:cache] = { value: proposal[:'8'], visible: false}
                proposal.delete(:'8')
              end
              if ['other'].include?(proposal[:category])
                proposal[:cache] = { value: proposal[:'11'], visible: false}
                proposal.delete(:'11')
              end
              proposal.delete(:phone)
            }
            next artist if prof.blank?
            unless prof[:productions].blank?
              artist[:proposals].each{|proposal|
                production = prof[:productions].detect{|production| production[:production_id] == proposal[:production_id]}
                next if production.blank?
                production[:children] = proposal[:children]
                production[:cache] = proposal[:cache] unless proposal[:cache].blank?
              }
            end
            prof[:phone] = phone
            Repos::Profiles.update prof
            artist
          }

          spaces = event[:spaces].map{ |space|
            prof = profiles.detect{|profile| profile[:profile_id] == space[:profile_id]}
            next space if space[:phone].is_a? Hash
            phone = { value: space[:phone], visible: false}
            space[:phone] = phone
            space[:links] = prof[:links]
            space[:photos] = prof[:photos]
            next space if prof.blank?
            prof[:phone] = phone
            Repos::Profiles.update prof
            space
          }
          @@events_collection.update_one({event_id: event[:event_id]},{
          "$set": {spaces: spaces, artists: artists}
          })
        }
      end

      def exists? event_id
        return false unless UUID.validate(event_id)
        @@events_collection.count(event_id: event_id) > 0
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
        @@events_collection.update_one({"spaces.proposal_id": space[:proposal_id]},
          {
            "$set": {"spaces.$": space}
          })
      end

      def update_artist artist
        @@events_collection.update_many({"artists.profile_id": artist[:profile_id]},
          {
            "$set": {'artists.$.name': artist[:name], 'artists.$.address': artist[:address]}
          })
      end

      def update_space space
        @@events_collection.update_many({"spaces.profile_id": space[:profile_id]},
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
        @@events_collection.update_many({"artists.profile_id": profile_id},
          {
            "$set": {'artists.$.own': 'true'}
          })
      end

      def delete_space_profile profile_id
        @@events_collection.update_many({"spaces.profile_id": profile_id},
          {
            "$set": {'spaces.$.own': 'true'}
          })
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
        @@events_collection.update_one({event_id: event_id},{
          "$set": {published: !event[:published]}
        })
        !event[:published]
      end

      def get_all
        grab({})
      end

      def get_event event_id
        grab({event_id: event_id}).first
      end

      def get_user_events user_id
        grab({user_id: user_id})
      end

      def get_event_owner event_id
        event = grab({event_id: event_id}).first
        event[:user_id]
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
    end
  end
end