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

      def add_artist event_id, artist
        current_artist_criteria =  {event_id: event_id, "artists.profile_id": artist[:profile_id]}

        if @@events_collection.count(current_artist_criteria) == 0
          @@events_collection.update_one({event_id: event_id},{
            "$push": {artists: artist}
          })
        else
          @@events_collection.update_one(current_artist_criteria,
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
        @@events_collection.update_one({event_id: event[:event_id], "spaces.profile_id": artist[:profile_id]},
          {
            "$set": {'spaces.$.name': artist[:name], 'spaces.$.address': artist[:address], 'spaces.$.phone': artist[:phone], 'spaces.$.email': artist[:email]}
          })
      end

      def modify_space space
        @@events_collection.update_one({"spaces.proposal_id": space[:proposal_id]},
          {
            "$set": {"spaces.$": space}
          })
        @@events_collection.update_one({"artists.profile_id": space[:profile_id]},
          {
            "$set": {'artists.$.name': space[:name], 'artists.$.address': space[:address], 'artists.$.phone': space[:phone], 'artists.$.email': space[:email]}
          })
      end

      def update participant
        @@events_collection.update_many({"artists.profile_id": participant[:profile_id]},
          {
            "$set": {'artists.$.name': participant[:name], 'artists.$.address': participant[:address], 'artists.$.phone': participant[:phone]}
          })
        @@events_collection.update_many({"spaces.profile_id": participant[:profile_id]},
          {
            "$set": {'spaces.$.name': participant[:name], 'spaces.$.address': participant[:address], 'spaces.$.phone': participant[:phone], 'spaces.$.category': participant[:category], 'spaces.$.description': participant[:description]}
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

        artist = event[:artists].detect{ |artist|
          artist[:proposals].any?{ |proposal|
            proposal[:proposal_id] == proposal_id
          }
        }

        proposals = artist[:proposals]
        proposals.reject!{ |proposal|
          proposal[:proposal_id] == proposal_id
        }

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

      def delete_profile profile_id
        @@events_collection.update_many({"artists.profile_id": profile_id},
          {
            "$set": {'artists.$.own': 'true'}
          })
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

      def add_slug event_id, slug
        @@events_collection.update_one({event_id: event_id},{
          "$set": {slug: slug}
        })
      end

      def available_slug? slug
        events = grab({})
        slugs = events.map{|event| event[:slug].downcase if event[:slug]}.compact
        !(slugs.include? slug)
      end

      def get_all
        grab({})
      end

      def get_event event_id
        grab({event_id: event_id}).first
      end

      def get_event_by_slug slug
        grab({slug: slug}).first
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
