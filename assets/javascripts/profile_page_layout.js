'use strict';

(function(ns){

  ns.Widgets = ns.Widgets || {};

  ns.Widgets.ProfileMainLayout = function(profiles){

    var _main = $('<main>');

    var _offCanvasWrapper = $('<div>').addClass('off-canvas-wrapper');
    var _offCanvasInner = $('<div>').addClass('off-canvas-wrapper-inner').attr({'data-off-canvas-wrapper': ''});
    var _offCanvasAside = $('<div>').addClass('off-canvas-grid-aside position-left-grid-aside').attr({id: 'offCanvas-navBar', 'data-off-canvas': ''});

    var _offCanvasSection = $('<div>').addClass('off-canvas-content').attr({'data-off-canvas-content': ''});

    var _mainLarge = $('<section>').addClass('pard-grid');
    var _gridSpacing = $('<div>').addClass('grid-spacing');


    var _aside = $('<nav>').addClass('grid-aside');
    var _asideContent = $('<div>');
    var _section = $('<section>').addClass('grid-section');
    var _sectionContainer = $('<div>').addClass('section-content');
    var _sectionContent = $('<div>');
    var _sectionHeader = $('<div>');

    Pard.Widgets.ProfileSection(profiles[0]['type']).render()(_sectionHeader, _sectionContent);
    Pard.Widgets.ProfileAside(_sectionHeader, _sectionContent, _asideContent);


    _offCanvasSection.append(_sectionContainer.append(_sectionHeader, _sectionContent));

    _offCanvasAside.append(_asideContent);

    _aside.append(_offCanvasAside);
    _section.append(_offCanvasSection);
    _offCanvasInner.append(_aside, _gridSpacing, _section);

    _mainLarge.append(_offCanvasWrapper.append(_offCanvasInner));
    _main.append(_mainLarge);

    return {
      render: function(){
        return _main;
      }
    }
  }


  ns.Widgets.ProfileAside = function (sectionHeader, sectionContent, asideContent) {

    var profiles = Pard.CachedProfiles['my_profiles'];

    asideContent.addClass('aside-container');
    var _buttonContainer = $('<div>').addClass('toUserPage-btn-container');
    var _toUserPageBtn =  Pard.Widgets.Button('Página de usuario', function(){
      location.href = /users/});
      
    _toUserPageBtn.setClass('toUserPage-btn');
    _buttonContainer.append(_toUserPageBtn.render());

    var _asideNavContent  = $('<div>');;

    asideContent.append(_buttonContainer, Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, _asideNavContent).render());
    
    // console.log(asideContent.html());

    // return{
    //   render: function(){
    //     return _createdWidget;
    //   }
    // }
  }

  ns.Widgets.ProfileAsideBar = function(sectionHeader, sectionContent, asideNavContent){

    asideNavContent.empty();
    
    var profiles = Pard.CachedProfiles['my_profiles'];

    ProfileNav = function(_profiles, _index, sectionHeader, sectionContent){

      asideNavContent.empty();
      
      var _profileNav = $('<div>').addClass('profile-nav-container');
      var _myOtherProfiles = $('<div>').addClass('other-profiles-nav-container');
      var _productionContent = $('<div>').attr('id','_productionsContent');
  
      var _reorderedProfiles = Pard.Widgets.ReorderArray(_profiles, _index).render();

      history.pushState({},'',_reorderedProfiles[0].profile_id);
      var _rgb = Pard.Widgets.IconColor((_reorderedProfiles[0]['color'])).rgb();
      var _backColor = 'rgba('+_rgb[0]+','+_rgb[1]+','+_rgb[2]+','+0.2+')';
      $('#main-profile-page').css({'background': _backColor});
      
      _reorderedProfiles.forEach(function(profile, index) {
        if(!(index)){ 
          Pard.Widgets.ProductionsNavigation(profile, sectionContent,_productionContent);
          _profileNav.append(
          Pard.Widgets.ProfilesNavigationSelected(
            profile,function(){
              Pard.Widgets.ProfileSectionContent(profile['type']).render()(sectionContent, profile)
            }).render(), _productionContent);
        }
        else { _myOtherProfiles.append(Pard.Widgets.ProfilesNavigationElement(profile, function(){
            Pard.Widgets.ProfileAsideBar(sectionHeader, sectionContent, asideNavContent);
            Pard.Widgets.ProfileSection(profile['type']).render()(sectionHeader, sectionContent, profile.profile_id);
              ProfileNav(_reorderedProfiles, index,sectionHeader, sectionContent);
          }).render());
        }
      });
      asideNavContent.append(_profileNav, _myOtherProfiles);
    }

    ProfileNav(profiles,0,sectionHeader, sectionContent);

    return {
      render: function() {
        return asideNavContent;
      }
    }
  }


   
 
  ns.Widgets.ProfilesNavigationSelected = function(profile, callback){

    var _createdWidget = $('<div>').addClass('profile-selected-container');
    var _profileCircle = $('<div>').addClass('profile-nav-circle-selected').css({'background-color': profile['color']});
    var _name = $('<h6>').addClass('profile-nav-name-selected selected-element').text(profile['name']);
    _name.hover(function(){$(this).addClass('text-link')},function(){$(this).removeClass('text-link')});
    _profileCircle.hover(function(){_name.addClass('text-link')},function(){_name.removeClass('text-link')});
    _name.click(function(){_profileCircle.trigger('click')});
    _profileCircle.click(function(){
      $('.selected-element').removeClass('selected-element');
      _name.addClass('selected-element');
      callback();      
    });
    var _icon = $('<div>').addClass('profile-nav-element-icon').html('P');
    var _colorIcon = Pard.Widgets.IconColor(profile.color).render();
    _icon.css({color: _colorIcon}); 

    _createdWidget.append(_profileCircle.append(_icon), _name);

    return {
      render: function() {
        return _createdWidget;
      }
    } 
  }



  ns.Widgets.ProfilesNavigationElement = function(profile, callback){
    var _createdWidget = $('<div>').addClass('profile-nav-element-container');
    var _profileCircle = $('<div>').addClass('profile-nav-circle').css({'background-color': profile['color']});
    var _name = $('<p>').addClass('profile-nav-element-name').text(profile['name']);
    _name.hover(function(){$(this).addClass('text-link')},function(){$(this).removeClass('text-link')});
    _profileCircle.hover(function(){_name.addClass('text-link')},function(){_name.removeClass('text-link')});
    _name.click(function(){_profileCircle.trigger('click')});
    _profileCircle.click(function(){
      $('.selected-element').removeClass('selected-element');
      _name.addClass('selected-element');
      callback();      
    });
    var _icon = $('<div>').addClass('profile-nav-element-icon').html('P');
    var _colorIcon = Pard.Widgets.IconColor(profile.color).render();
    _icon.css({color: _colorIcon}); 
    
    _createdWidget.append(_profileCircle.append(_icon), _name);

    return {
      render: function() {
        return _createdWidget;
      }
    } 
  }


  ns.Widgets.ProductionsNavigation = function(profile, sectionContent, productionContent){

    productionContent.empty();

    var _proposals = [];

    (profile.proposals) ? productionContent.addClass('productions-content') : productionContent.removeClass('productions-content');
    if (profile.proposals) _proposals = profile.proposals;
    _proposals.forEach(function(proposal, index) {
      var _productionItem = $('<span>');
      var _icon = $('<span>').addClass('material-icons').html('&#xE405;');
      var _title = $('<span>').text(' '+proposal['title']);
      _productionItem.append(_icon, _title).addClass('production-item').click(function(){ 
        $('.selected-element').removeClass('selected-element');
        _title.addClass('selected-element');
        Pard.Widgets.ArtistProductionSectionContent(proposal.proposal_id, sectionContent)});
      _productionItem.hover(function(){_title.addClass('text-link')}, function(){_title.removeClass('text-link ')});
    	 productionContent.append($('<div>').addClass('row productions-list-item').append(_productionItem));
    });

    return {
      render: function() {
        return  productionContent;
      }
    }
  }


  ns.Widgets.ProfileSection = function(type) {

    var profiles_map = {
      artist: Pard.Widgets.ArtistSection,
      space: Pard.Widgets.SpaceProfileSectionContent
    }

    return {
      render: function( ){
        return profiles_map[type];
      }
    }
  }


  ns.Widgets.ProfileSectionContent = function(type) {

    var profiles_map = {
      artist: Pard.Widgets.ArtistSectionContent,
      space: Pard.Widgets.SpaceProfileSectionContent
    }

    return {
      render: function( ){
        return profiles_map[type];
      }
    }
  }


  // ns.Widgets.ArtistProfileSection = function(headerContent, sectionContent, profile_id) {

  //   profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
  //   var profile = Pard.ProfileManager.getProfile(profile_id);

  //   sectionContent.empty();
  //   headerContent.empty();

  //   var _sectionContent = sectionContent;

  //    if('profile_picture' in profile && profile.profile_picture != null){
  //     var _photo = $.cloudinary.image(profile['profile_picture'][0],
  //       { format: 'jpg', width: 50, height: 50,
  //         crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
  //     _sectionContent.append(_photo);
  //   }

  // 	['name','city', 'bio', 'personal_web'].forEach(function(element) {
  //     if(profile[element] != null) _sectionContent.append( $('<div>').text(profile[element]));
  //   });

  //   var _icon = $('<span>').addClass('fb_icon');
  //   _sectionContent.append(_icon);
  //   //console.log(Pard.CachedEmbeds);

  //   $(document).ready( function(){
  //     _sectionContent.append(Pard.CachedEmbeds['facebook']);
  //     console.log(_instagramphoto);
  //   });
    
  //   // //Facebook posts and videos
  //   // var _facebook = $('<div>').addClass('fb-post').attr('data-href', 'https://www.facebook.com/sesiondemicrosabiertos/photos/a.1633591080199483.1073741827.1633590566866201/1997144280510826/?type=3&theater');
  //   // _facebook.css('width', '350'); //It won't go below 350
  //   // _sectionContent.append(_facebook);
  //   // console.log(_facebook);

  //   //Instagram
  //   var _instagramphoto = $('<a>').attr('href', 'https://www.instagram.com/p/BDR_nV-oVR');
  //   var _instagram = $('<blockquote>').addClass('instagram-media').append(_instagramphoto);
  //   _sectionContent.append(_instagram);
    

  //   //Pinterest
  //   var _pinterest = $('<a>').attr({'data-pin-do':"embedPin" ,'href': 'https://es.pinterest.com/pin/399764904401679797/'});
  //   _sectionContent.append(_pinterest);

  //   //Vine
  //   var _vine_url = 'https://vine.co/v/iHTTDHz6Z2v';
  //   if(_vine_url.split('/').pop() != 'simple') _vine_url += '/embed/simple';
  //   var _vine = $('<iframe>').addClass('vineIfame').attr('src', _vine_url);
  //   _vine.on('load', function(){
  //   });

  //   _sectionContent.append(_vine);

  //   //Youtube, Vimeo, Flickr and Twitter, SoundCloud
  //   var url = "https://www.youtube.com/watch?v=Hq7Ml2Gz62E";
  //   url = 'https://soundcloud.com/john-motherlesschild/mr-night-day';
  //   $.getJSON("https://noembed.com/embed?callback=?",
  //     {"format": "json", "url": url}, function (data) {
  //     _sectionContent.append(data.html);
  //   });

  //   //Spotify
  //   var spotify_url = 'http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V';
  //   var id = spotify_url.split('/').pop();
  //   var _spotify = $('<iframe>').attr({'src': 'https://embed.spotify.com/?uri=spotify:track:' + id, 'frameborder': '0', 'allowtransparency': 'true'});
  //   _sectionContent.append(_spotify);

  //   //BandCamp
  //   var _bandCampiframe = '<iframe style="border: 0; width: 100%; height: 120px;" src="https://bandcamp.com/EmbeddedPlayer/album=1364804381/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/track=1928405551/transparent=true/" seamless><a href="http://6ixtoys.bandcamp.com/album/6ix-toys">6ix Toys by 6ix Toys</a></iframe>'
  //   var _bandCamp_url = '';
  //   _bandCampiframe.split('"').forEach(function(string){
  //     if(string.match('EmbeddedPlayer')) _bandCamp_url = string; 
  //   });
  //   var _bandCamp = $('<iframe>').attr({'style': 'border: 0; width: 100%; height: 120px;', 'src': _bandCamp_url});
  //   _sectionContent.append(_bandCamp);

  //   var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
  //   var _callButton = Pard.Widgets.CallButtonArtist(profile);
  //   var _myArtistCallProposals = Pard.Widgets.MyArtistCallProposals(profile.calls);

  //   _sectionContent.append(_modifyProfile.render(), _myArtistCallProposals.render(), _callButton.render());

  //   return{
  //     render: function(){
  //       return _sectionContent;
  //     }
  //   }
  // }

  ns.Widgets.SpaceProfileSectionContent = function(sectionContent, profile_id) {

    profile_id = profile_id || Pard.CachedProfiles['my_profiles'][0].profile_id;
    var profile = Pard.ProfileManager.getProfile(profile_id);

    sectionContent.empty();

    var _sectionContent = sectionContent.addClass('grid-element-content');

    if('profile_picture' in profile && profile.profile_picture != null){
      var _photo = $.cloudinary.image(profile['profile_picture'][0],
        { format: 'jpg', width: 50, height: 50,
          crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
      _sectionContent.append(_photo);
    }

    ['name','city', 'address', 'category', 'bio', 'personal_web'].forEach(function(element) {
      if(profile[element] != null) _sectionContent.append( $('<div>').text(profile[element]));
    });

    if('photos' in profile && profile.photos != null){
      profile.photos.forEach(function(photo){
        var _photo = $.cloudinary.image(photo,
          { format: 'jpg', width: 50, height: 50,
            crop: 'thumb', gravity: 'face', effect: 'saturation:50' });
        _sectionContent.append(_photo);
      });
    }

    console.log(profile.links);
    if('links' in profile && profile.links != null){
      var _id = profile.links[0].link.split('=').pop();
      var _video = $('<iframe>').attr({'src': 'https://www.youtube.com/embed/' + _id});
      _sectionContent.append(_video);
    }

    var _modifyProfile = Pard.Widgets.ModifyProfile(profile);
    var _callButton = Pard.Widgets.CallSpaceButton(profile);
    var _mySpaceCallProposals = Pard.Widgets.MySpaceCallProposals(profile.calls);

    _sectionContent.append(_modifyProfile.render(), _mySpaceCallProposals.render(), _callButton.render());

    return{
      render: function(){
        return _sectionContent;
      }
    }
  }


  ns.Widgets.ArtistProductionSectionContent = function(proposal_id, sectionContent) {

    sectionContent.empty();
    sectionContent.append(Pard.Widgets.MyArtistProductionsContent(proposal_id).render(), Pard.Widgets.ModifyProduction(proposal_id, sectionContent).render());

    // return{
    //   render: function(){
    //     return sectionContent;
    //   }
    // }
  }
  
}(Pard || {}));
