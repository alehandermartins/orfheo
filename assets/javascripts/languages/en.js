'use strict';

(function(ns){
  ns.langs = ns.langs || {}

  ns.langs.en = {
    dictionary: {
      accept: 'accept',
      address: 'address',
      ages: 'ages',
      amend: 'amend',
      artist: "artist",
      artists: "artists",
      availability: 'availability',
      category: 'category',
      comments: 'comments',
      confirmed: 'confirmed',
      copy: 'copy',
      day: 'day',
      description: 'description',
      duration: 'duration',
      email: 'email',
      first: "first",
      latitude: 'latitude',
      last: "last",
      longitude: 'longitude',
      name: 'name',
      next: "next",
      no: 'no',
      organization: "organization",
      organizations: "organizations",
      permanent: 'permanent',
      phone: 'phone',
      previous: "previous",
      profile: 'profile',
      program: 'program',
      schedule: 'schedule',
      search: 'search',
      short_description: 'short description',
      space: "space",
      spaces:'spaces',
      table: 'table',
      title: 'title',
      type: 'type',
      yes: 'yes'
    },
    partners:{
      collaborators:"Collaborators",
      sponsors:"Sponsors"
    },
    categories:{
      cultural_ass: "Cultural Space",
      commercial: "Business",
      home: "Private Home",
      open_air: "Open Air",
      festival:"Festival",
      association:'Association',
      ngo:"NGO", 
      collective:"Collective", 
      interprise:"Enterprise", 
      institution:"Institution",
      federation: "Federation",
      foundation:"Foundation",
      music:"Music",
      arts: "Performing Arts",
      expo: "Exposition",
      poetry: "Poetry",
      audiovisual: "Adiovisual",
      street_art: "Street Art",
      workshop: "Workshop",
      other: "Other",
      gastronomy: "Gastronomy"
    },
    form:{
      incomplete: "Please check the required fields."
    },
    popup_alert:{
      error: "¡Error!",
      noAction: "Unable to execute action",
      serverProblem:{
        title: "Server Error",
        mex: "<p>Operation not executed. Please try again. </p> <p>If the error persists do not forget that we are at your disposal to help you. Write to us at <a href='mailto:info@orfheo.org' target='_top'> info@orfheo.org</a> o contact us at the chat of our <a href='https://www.facebook.com/orfheo.org', target='_blank'>facebook page.</a></p>"
      }
    },
    popup:{
      delete:{
        title:"¿Are your sure?",
        user: "By confirming, all your data will be deleted from orfheo: all your profiles and contents will be canceled.",
        profile: "By confirming, your profile will be deleted and with it all its contents. However, proposals sent to calls will not be canceled.",
        confirm:"Confirm",
        cancel: "Cancel",
        production:"By confirming, your artistic project will be removed from your portfolio. This action will not affect your registration in calls."
      },
      modifypasswd:{
        title:"Enter a new password",
        password:"Password",
        passwordConf: "Confirm your password",
        notequal: "The passwords don't match",
        tooshort:"Password must be at least 8 characters long",
        check:"Please verify that the passwords are equal and have a minimum of 8 characters",
        success: "The password has been changed."
      },
      recover:{
        title: "Recover your password",
        submit: "Send"
      },
      termsAndConditions:{
        title: "General conditions",
        date:"Last update: 2016 May 1",
        part1:'<p> <strong>Welcome!</strong></p><p> <strong>Orfheo is based on a powerful principle: we can do more things together than separately.</strong></p><p>It is people like you who make it possible for this place not only to exist, but also to grow and thrive.</br>These general conditions explain the service and the relationship between users, rights and reciprocal responsibilities.</br> <strong>Being part of orfheo is free</strong> and by doing so you are accepting these general conditions.</p>',
        subtitle2: "General principles:",
        mex2: "<p>Orfheo has no firm norms beyond the general principles enunciated here:<ul><li>Respect the orfheo citizens even when you disagree with them.</li> <li>Share contents civilly, avoid personal attacks and generalizations as well as the publication of links or texts that may be offensive for the community, racist, sexist, homophobic or incite violence of any kind.</li> <li>Act in good faith, be open, welcoming and inclusive.</li> <li>If you do not respect these principles we will contact you so you can give us an explanation. Together we will find a solution.</li> </ul></p>",
        subtitle3: "We commit to:",
        mex3: "<p><ul><li>Describe how your information can be used or shared in these general conditions.</li> <li>Use reasonable measures to keep your sensitive information safe.</li> <li>Let the information that you decide to share flow in the community.</li> <li>Promote values ​​such as solidarity, a sense of community, meritocracy, equity, respect and harmony with the environment.</li> <li>Respect and defend the community of orfheo.</li> <li>Listen and welcome any kind of suggestion and constructive criticism.</li></ul></p>",
        subtitle4: "Terms of use and privacy:",
        mex4: '<p>Here we explain how we collect and share your personal information / data / contents.<ul><li>We collect very little personal information about you.</li> <li>We do not rent or sell your information to third parties, ie: we do not share your data with third parties for marketing purposes.</li> <li>It is possible for the information collected in orfheo to be shared with third parties according to our ideology, complying with the law and with the intention of bringing benefit to the whole community.</li> <li>You are responsible for the contents you share and their privacy measures.</li> <li>We will occasionally send you emails regarding important information.</li> <li>The quality of the data you provide is useful for you, so that we can improve your experience as a user, letting us develop new functions, so that your experience is unforgettable.</li> <li>Everything you publish in orfheo is public, can be seen and eventually used by an external observer.</li> <li>We may sometimes launch feedback surveys, but you will never be required to participate in these surveys.</li> <li>You do not need to create an account to explore and visualize any of the contents.</li> <li>In order to create an account, you only need to give us your email address.</li><li>Anyone can join and leave orfheo at any time.</li> </ul></p>',
        subtitle5:'Advertising:',
        mex5: "<p>Right now there is no form of advertising within orfheo. In the future, we do not exclude the possibility of the presence of non-intrusive advertising related to the artistic-cultural world, which can provide useful and valuable information for the citizens. We believe that advertising can be effective without being annoying. We do not approve the presence of advertising in the form of pop-ups that may interfere with the display of orfheo contents. </p>",
        subtitle5_5:'Project sustainability:',
        mex5_5:'<p>As promised, being part of orfheo does not have and will never have no cost to any user. However, the maintenance of a web with this complexity has a cost, as well as the sustainability of the lives of the people who work on it on a daily basis. Therefore, launching a call and being able to access the relative management tool has a price, which is decided together, based on a minimum basis, depending on the type of event that you want to organize.</p>',
        cookies: 'Cookies policy:',
        cookiesMex1: 'Cookies are a computer element widely used in the internet. When you access a web page, some information is stored in your browser memory so the website can quickly access that information in the future.',
        cookiesMex2: 'Orfheo uses cookies for the sole purpose of improving the browsing experience of its users. For example, we store information to allow a faster and continuous login, avoid disconnexions from the site in the case of server restarts, and remembering preferences or choices throughout the browsing process.',
        cookiesMex3:'In general, because of the structure of the internet today, cookies are an essential element. By law, every web that uses them, is obliged to warn its users so that they know what is happening.',
        cookiesMex4: 'The same information displayed here is also available in the terms and conditions section. In case of modification, the citizens of orfheo will be notified well in advance.',
        subtitle6: 'Updates:',
        mex6: 'We reserve the right to modify, if necessary, the general conditions and adapt them to future developments. We assume the duty and the commitment to inform of the changes to all citizens of orfheo, so that they can know the updates in advance.',
        subtitle7: '¡Thanks a lot!',
        finalMex: '<p> If you have questions or suggestions, please send an email to <a href="mailto:info@orfheo.org"> info@orfheo.org </a>. </ P> <p> Thanks for reading until here. We hope you enjoy in and out of orfheo. </ Br> Your participation in creating, maintaining and improving this place is a must. </ P> <p> We appreciate you taking the time to read about the project, and we thank you for contributing. By what you do, you are helping to build something really important, not only a collaborative project, but also a vibrant community focused on a very noble goal.</p>'
      },
      noMapLocation:{
        title: "¡Attention!",
        mex: "Google does not recognize the address you provided and therefore can not be located on any map.",
        fix:"Change the address",
        ok:"Proceed anyway"
      }
    },
    widget:{
      search:{
        placeholder:"Search by tags"
      },
      uploadPhoto:{
        btn: "Upload an image",
        tooBigError: "The size of the images can not exceed 500Kb. You can quickly reduce it by using, among many others,  <a href = 'http://optimizilla.com/es/'  target='_blank'>this web</a>.",
        max5: "Five images maximum.",
        max1:"One image maximum.",
        max4: "Four images maximum.",
        acceptedFormat: "Accepted formats: .gif, .jpeg, .jpg, .png"
      },
      inputName:{
        unavailable: "This profile name already exists. Choose another in order to proceed."
      },
      inputTel:{
        show:"Show in my profile page"
      },
      inputCache:{
        show: "Show in my portfolio"
      },
      inputWeb:{
        placeholder: "Copy and paste the corresponding link here and click the validation button"
      },
      inputAddressArtist:{
        city:"City*",
        postalCode:"Postal Code*",
        neighborhood:"Neighborhood (optional)"
      },
      inputChildren:{
        all_public:'All public',
        baby:"Kids", 
        family:"Family", 
        young: "Youth",  
        adults: "Adults"
      },
      inputAddressSpace:{
        street: "Street",
        number: "Number",
        city:"City",
        postalCode:"Postal Code",
        door:"Floor / Door",
        state: "Country",
        warning:"¡Attention! Google does not recognize the address you provided and therefore can not be located on any map.",
        insertGeo:"If the location is not correct, manually insert your geographic coordinates and save them by clicking ",
        insertGeoBtn:"here"
      },
      multimediaManager:{
        btn: "Modify or create a new one",
        title: "Manage your multimedia content",
        mex:"You can add:",
        videoList:"<strong>videos</strong> from:  youtube, vimeo, vine, facebook",
        imageList:"<strong>images</strong> from: your computer, instagram, flickr, pinterest, twitter, facebook",
        audioList:"<strong>audios</strong> from: soundcloud, bandcamp, spotify",
        photoL:"Upload images from your computer (4 max, size must not exceed 500kb each)"
      },
      multipleDaysSelector:{
        placeholder: "Select one or more options",
        selectAll: "Select all",
        alwaysAv: "Available every day"
      },
      inputMultimedia:{
        placeholder:"Copy and paste the corresponding link/code here and click the validation button",
        invalid:"Not a valid entry",
        acepted:"Accepted entries",
        popup:{
          title:"How to add...",
          item1:'...an image from <strong>flickr, instagram, pinterest</strong> (a pin) or a video from <strong>youtube, vimeo, vine</strong> or an audio from <strong>soundcloud</strong>:',
          sublist1_1:"open the image, video or audio in the corresponding website",
          sublist1_2:'copy its link directly form the browser or using the option "share" or "copy link"',
          sublist1_3:"paste it in the orfheo formulary field",
          sublist1_4:'click on the validation button',
          itemTwitter:'...an image from <strong>twitter</strong> (a tweet):',
          sublistTwitter_1:'click on the tweet you want to share',
          sublistTwitter_2:'on the opening popup, click on the three dotted icon',
          sublistTwitter_3:'select "Copy link to Tweet"',
          sublistTwitter_4:'copy the link and paste it in the orfheo formulary field',
          sublistTwitter_5:'click on the validation button',
          item2:'...an image, a post or video published on <strong>facebook</strong>:',
          sublist2_1:'click on the publication date located on the upper part of the post',
          sublist2_2:'copy the address of the page that opens up',
          sublist2_3:'paste the address in the orfheo formulary field',
          sublist2_4:'click on the validation button',
          item3: '...an audio from <strong>bandcamp</strong>:',
          sublist3_1:'in the song page click on "Share/Embed" (under the main picture) and then click on "Embed this album"',
          sublist3_2:'Select a style for the music player',
          sublist3_3:'copy the html code form the "Embed" field located on the upper left corner',
          sublist3_4:'copy the link and paste it in the orfheo formulary field',
          sublist3_5:'click on the validation button',
          item4: '...an audio from <strong>spotify</strong>:',
          sublist4_1:'select a song from a playlist with the mouse right button',
          sublist4_2:'click on "Copy Song Link"',
          sublist4_3:'copy the link and paste it in the orfheo formulary field',
          sublist4_4:'click on the validation button',
          finalMex: 'Finally, consider that you can only import into orfheo multimedia contents declared public on the web where they have been uploaded.'
        }
      }
    },
    createProfileCard:{
      text: 'Create a profile'
    },
    createProfile:{
      artistText:'Show your portfolio <br> and participate in big events',
      spaceText: 'Host artistic events and position yourself in the cultural map',
      organizationText: 'Announce your project and launch calls',
      introA: 'This information will be displayed on your profile page, you can modify it. It will let others know about you.',
      introS: 'This information will be displayed on the profile page of your space, you can modify it.',
      introO: 'This information will be displayed on the profile page, you can modify it.',
      submit: 'Create',
      artistForm:{
        nameL: "Artistic name",
        nameH: "The name for your artist profile",
        photoL:"Profile picture (500kb maximum)",
        bioL: "Biografy / Information",
        bioH: "Anything you want to share about your artistic-cultural life.",
        addressL: "City and Postal code",
        addressH: "Indicating your city and postal code will make it easier to locate you for a possible contact.",
        phoneL:"Phone number",
        webL:"Personal website and links to social networks",
        webH: "You can add links to both your websites and personal blogs as well as to your profiles on social networks (photos and videos are managed along with your artistic proposal).",
        colorL: "Pick a color",
        colorH:"Is the personal color for your profile!"
      },
      spaceForm:{
        nameL:"Space name",
        nameH:"The name for your space profile.",
        addressL:"Address",
        addressPlaceholder: 'Ex: Gauden Road, London, United Kingdom',
        catL: "Space type",
        catPlaceholder:'Select',
        bioL:"Description / Information",
        bioPlaceholder:'Dimensions, characteristics, activities that usually hosts, etc.',
        bioH: "Anything you want to share about your space.",
        phoneL: "Phone number",
        webL: "Personal website and links to social networks",
        webH: "You can add links to both your websites and personal blogs as well as to your profiles on social networks.",
        linksL: 'Online materials',
        linksH:'Add videos, pictures and audios from your social networks.',
        photoL:"Space pictures (5 maximum, size must not exceed 500kb each)",
        photoH: "The first picture will be your profile picture",
        colorL: "Pick a color",
        colorH: "Is the personal color for your profile!"
      },
      organizationForm:{
        nameL: "Organization name",
        nameH: "The name for your organization profile.",
        catL: "Organization type",
        catPlaceholder:'Select',
        addressL:"Address of the organization's headquarters",
        bioL: "Information / Project",
        bioH: "Anything you want to share about the organization."
      }
    },
    modifyProfile:{
      title: 'Modify your profile',
      delete: 'Delete the profile',
    },
    proposal:{
      form:{
        nameL:"Name",
        emailL:"Email",
        addressL:"Address",
        bioL:"Description / Information",
      }
    },
    production:{
      createTitle: 'Create an artistic proposal',
      form:{
        titleL: "Title for the artistic proposal",
        descriptionL: 'Desripction',
        descriptionH: 'Describe in more detail your artistic proposal.',
        short_descriptionL:'Brief description',
        short_descriptionH:'Summarize your artistic proposal in a maximum of 80 characters. Remaining:',
        durationL: "Duration *",
        childrenL:"Public addressed",
        childrenH: "Indicate to which type of audience the proposal is addressed.",
        linksL:"Online materials",
        linksH: "Add videos, pictures and audios from your social networks. This material will let others better know your art.",
        photoL: "Your art pictures (4 maximum, size must not exceed 500kb each)",
        cacheL:"Cache / Production expenses",
        noDefinedDuration:"It has no defined duration",
        catSel:'Select a category *',
        submit: 'Create'
      },
      modify:{
        title: 'Modify your artistic project',
        cat:'Category',
        initMex: 'With this form you can modify the contents of your artistic project. Changes will not affect data sent to calls.',
        delete: 'Delete this artistic project'
      }
    },
    signUp:{
      btn:'Join',
      popup:{
        title: 'Start by creating an account...',
        email:'Email',
        passwd:'Password',
        insertEmail:'Your email',
        confirmEmail:'Confirm your email',
        tooshort: 'Password must be at least 8 characters long.',
        notequal:'Mail fields do not match.',
        format: 'Email must have a valid format.',
        submit:'Create an account',
        mex: '...doing it, of course, <strong>is totally free :) </strong>',
        conditions: 'general conditions',
        conditionText:'By creating an account, you confirm that you agree with our ',
        length: '8 characters minimum'
      }
    },
    login:{
      dropdown:{
        recover:'Forgot your password?',
        email:'Email',
        passwd:'Password',
        gobtn:'Login',
        rememberme:'Remember me'
      },
      popup:{
        notValidated: 'User not validated',
        notValidatedmex: 'When registering, we send you an email with a link to activate your account. Check in the spam folder...',
        sendOther:"...or re-type your email here, and we'll send you another one.",
        okbtn:'Send',
        notValidEmail:'The email is not valid',
        sent: 'We have sent you an email with the instructions to access your account.',
        nouser:'This user does not exist.',
        notExisting: '¡There is no user associated with this email!',
        registerbtn:'Register',
        registerTitle: 'Register to proceed'
      },
      eventPage:{
        nouser: "If you don't have an account:",
        signUp: 'Create an account',
        signUpTitle: 'Create an account...' 
      }
    },
    call:{
      initText:'This call is for profiles of the type ',
      conjunction:' and ',
      chooseProfile: 'Sign up with an existing profile',
      newProfile: '...or create and sign up with a new one',
      createProfile:{
        title:'Create a profile and sign up as:',
        artistText: 'Show your art and build your portfolio',
        spaceText: 'Host and propose activities',
        organizationText: 'Offer your space and send proposals'
      },
      successTitle: '¡Awesome!',
      succesMex:'You have successfully signed up.',
      sendOther: 'Send another proposal',
      toProfile: 'Go to your profile page',
      alreadyInscribed: {
        title: 'You have already sign up as this space :)', 
        mex: 'If you want, you can send proposals to perform during the event.',
      },
      stop:{
        title: 'ATTENTION, YOU SHALL NOT PASS',
        mex1:'This call is for profiles whith type<strong>',
        mex2:'</strong>. Select or create one of the accepted types to proceed.'
      },
      form:{
        initMex:"Fill in this <strong>form</strong> in order to sign up with %{link} to <strong>%{organizer}</strong>'s call",
        portfolio:'Apply with a portfolio proposal',
        catPlaceholder: 'select how you want to sign up',
        newProposal: '...or propose something new',
        chooseHow: 'You can participate hosting or proposing art:',
        stagebtn:'Offer your space',
        perfomerbtn: 'Propose your art',
        partI:'PART I: This information will be stored in your <strong>portfolio</strong> and shown in your profile',
        partII: 'PART II: Only you and the organizers of the event will see this information',
        initSpace: 'Only you and the organizers of the event will see this information',
        finalMex: 'ATTENTION: After submiting, you can amend but <strong>not modify</strong> the content of this form. For this reason, please, review carefully all the fields before clicking the submit button.',
        sendbtn: 'Submit'
      }
    },  
    footer:{
      languages:'Languages',
      project: 'Project',
      contact: 'Contact',
      services:'Services',
      conditions: 'Conditions'
    },
    header:{
      events:'Events',
      profiles:'Profiles',
      news:'News',
      callToAction: 'Launch your call',
      home: 'Home',
      insideDropdown:{
        delete: 'Delete my account',
        modifypasswd:'Modify password',
        logout:'Logout',
        contact:'Contact orfheo',
        event:'Event'
      }
    },
    welcome: {
      profilesSection: {
        title: "Your cultural community is calling you<br>Join orfheo as:",
        artist: "Share your art,<br>join a call,<br>hatch a network, discover, create...",
        space: "Make the best out of your space,<br>host artistic events,<br>open the doors to culture",
        organization: "Announce your project,<br>launch calls,<br>expand your community",
        create: "Create a profile"
      },
      networkSection: {
        title: 'Unite people, </ br> create through networking with your cultural community',
        subtitle1: 'Here and now',
        subtitle2: 'Take control',
        subtitle3: 'Do it',
        section1: 'Discover projects and let yourself be known </ br> for what you do',
        section2: 'Involve the community, </ br> launch your call',
        section3: 'Create unforgettable experiences together',
        link: 'Explore the advantages of launching your call in orfheo'
      },
      inspireSection: {
        title: 'The future is here, in front of you',
        section: "You have imagined it, but now it is real. <br> You have at your disposal a universe of new, great cultural possibilities.",
        link: 'Let yourself be inspired'
      },
      servicesSection: {
        logo: 'S e r v i c e s',
        subtitle1: 'Management platform',
        subtitle2: 'Creative consultancy',
        subtitle3: 'API connection',
        section1: 'Create an event,</br> launch a call, </br>use the powerful management tool </br>and publish an interactive program',
        section2: 'Make the best out of your project, </ br> feed your community </ br> and explore new creative strategies during the process',
        section3: 'Forward all your event data to your web page or mobile application, using it as it suits you and keeping everything updated',
        link: 'Discover more'
      }
    },
    eventsTab:{
      organizer: 'Organizer: ',
      announcing: 'Call opens on: ',
      opened: 'Open call',
      closed: 'Closed call',
      finished: 'Finished',
      for: 'for %{participants}',
      until: ' until %{date}',
      onlineProgram: '¡Online program!',
      contact: 'Create an event, contact us'
    },
    contact: {
      logo: 'C o n t a c t',
      servicesTab: {
        tab: 'Services',
        title: 'What does orfheo offer you?',
        mex1: 'Orfheo aims to create and give value to cultural communities and the encounters that already exist or can be generated in real life. Therefore, the possibilities we offer are mainly focused on supporting, promoting and facilitating the creation, diffusion and above all <strong> on the management of large participative events </strong>. Specifically, with orfheo you can take advantage of the following services:',
        subtitle2: 'Management platform:',
        mex2: 'A powerful innovative web tool that allows you to launch your call and manage all relative data with extreme ease and simplicity. You can consult, organize, filter and modify received proposals as well as create new ones to insert into your programming. Making the program of your event will be as easy as dragging cards inside a calendar and taking out mailing lists to contact artists and spaces will cost you a single click. You can publish online an interactive program, updateable at any time, that perfectly adapts to any mobile device, functioning as the perfect guide for your audience.',
        subtitle3: 'Creative counseling:',
        mex3: 'The orfheo team has professionals with the expertise of organizing and managing large participatory events. You will be able to take advantage of a constant monitoring throughout the process of preparation of your event and discover new creative strategies focused on making the best out of your cultural community.',
        subtitle4: 'API Connection:',
        mex4: 'The API service allows you to receive and use data related to your events and calls in your mobile application or website. Any changes you make in orfheo will automatically update all your connected platforms. You can have all your information always updated, where and when you want.',
        mex5: 'For more information, check our %{link} and contact us through the following form:',
        servicesPage: 'services page'
      },
      techTab:{
        tab: 'Tech support',
        title: '¿How can we help you?',
        mex1: 'We are here to provide technical support, advice, answer your questions or give you useful information when you need it most.',
        mex2: "We'll get back to you right away."
      },
      feedBackTab:{
        tab: 'Feedback',
        title: 'What do you think of orfheo?',
        mex1: 'For being able to improve it is necessary to put ourselves into play and be questioned. We would be happy to know what you think of orfheo, what features you are missing and would like to have at your fingertips, what would you change, remove or add...',
        mex2: 'Any constructive criticism is welcomed, it will help us provide a better service.',
        mex3: '¡Your opinion is important!'
      },
      collaborateTab:{
        tab: 'Collaborate',
        title: 'Do you want to be a part?',
        mex1: 'We would like to share knowledge and continue to develop this project so that all citizens of orfheo can always enjoy the community. We would also like to give the possibility of using this tool to all those who wish it.',
        mex2: 'We believe that inclusion inspires innovation and therefore we are always open to hear ideas and collaborate.',
        mex3: 'Contact us at ',
        mex4: 'There are many ways to collaborate in orfheo:',
        mex5: 'as a partner: </br> If you have a business and as we believe that we can do more things together than separately, do not hesitate to send us your proposal of alliance.',
        mex6: 'as a sponsor: </br> Thanks to you, who wants to invest and/or collaborate through publicity and sponsorship, we can offer the possibility of financially help the projects of the orfheo community.',
        mex7: 'as a worker: </br> work in orfheo as a creative, artist, designer, programmer, community manager, administrative or commercial manager. Send us information about yourself.',
        mex8: 'as a patron: </br> generously support a reality, because you believe in it. Supporting orfheo means being part of a project with the potential to improve our world.',
        mex9: 'as a volunteer: </br> contact us if you want to learn through the development of orfheo or, if you already have the knowledge, to offer your time to a noble cause.'
      },
      contactTab:{
        tab: 'Contact',
        title: '¡Here we are!',
        country: 'Spain'
      },
      eventContact:{
        title: 'Your events in orfheo',
        mex1: 'In order to create an event or for more information, contact us through the following form:',
        mex2: 'Creating an event in orfheo will allow you to launch <strong>your call</strong> in the community and access the <strong> management tool </strong> that will accompany you until the publishing of<strong> your interactive program </strong> (more information on our %{link}).'
      },
      contactUs: {
        title: 'Contact orfheo',
        mex1: 'We are always available to provide technical assistance, advice, answer your questions or give you useful information when you need it most.',
        mex2: 'Send us a message, we will answer you right away :)'
      },
      forms: {
        name: 'Name*',
        email: 'Email*',
        phone: 'Phone number',
        subject: 'Subject',
        links: 'Links to webs/social networks of your project',
        call_me: 'I want to be contacted by phone',
        hangout_me: 'I want a Hangout/Skype appointment',
        mex: 'Message*',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        daysPlaceholder: "Select your availability during the week",
        everyday: "Everyday",
        always: "Available every day",
        periods: ['Morning', 'Afternoon'],
        periodsPlaceholder: "Select your availability during the day",
        everyperiod: "Morning and afternoon",
        anytime: "Available morning and afternoon",
        profileName: 'Name of your orfheo profile'
      },
      send: 'Send',
      correct: 'Message sent successfully. ',
      thanks: '<br>Thank you for contacting us. <br> We will reply as soon as possible :)',
      noSend: 'Message not sent:',
      checkFields: 'Please check the required fields'
    },
    project:{
      baseline: 'More things can be done together than separately',
      mex1: '<p> Welcome to orfheo, </p><p> a special site, which becomes a reality, and then a community thanks to all its citizens. Orfheo is a platform for artists, cultural actors, developers, creators, social workers... people free from strict categories and schemes.</p><p> We have created a unique world, a web not only able to facilitate the work of the organization and the management of a call, but to give value to the proposals of the creators beyond a mere encounter. </p><p> You are in your online artistic community, where you can see your conventions, and from where you can show your projects and find others. </p><p> You have a tool, a mechanism for cultural management with which to create and organize events, discover through profiles links and connections, bring to reality dreams and ideas. Orfheo is a place where different colors are found in the saturation unit, where all color is light and the only way to see it is through observation of its relationship to the surroundings. </p><p> We believe in the power of sharing and we strive for new meritocratic frontiers to be possible in the working ecosystem </p><p> We hope that this small world can serve to stimulate creations together and become a place for exchanging ideas.</p><p> We want to give the possibility of using this tool to all people who want it, and who respect the minimum general conditions. </p><p> We would like to share our knowledge and continue to develop this project that has just begun, so that all citizens of orfeo are able to enjoy the community. </p><p> Knowing how to listen is fundamental in being able to move on, you are free to express and communicate your points of view at any time. </p><p> We encourage you to imagine a little more and to share with other people unforgettable experiences. </p>',
      more: 'Read more...',
      subtitle: 'The pillars',
      list1: '<p>SHARING <ul><li> Knowing more about each other means learning from each other. </li><li> We share our value where value = (experiences + knowledge) x attitude. </li><li> We share our ideas and creative inspirations in order to create/inspire enriching experiences. </li><li> Think about the community and the community will think about you.</li></ul></p>',
      list2: '<p>IDENTITY <ul><li> We defend the individual as something unique, authentic, a dot in the space. We value the group, as in the chromatic circle, in which personal identity, a cultural trait, a hue, a color, is defined. </li><li> We play an active role in the development of a free world, which is possible thanks to the small effort of collectives of many people. </li></ul></p>',
      list3: '<p>INFORMATION <ul><li>The need for information is stronger than all borders. We would like to facilitate access in as many different languages ​​as possible. </li><li> We want you to have access to information anywhere, anytime. </li><li> We do not want you to search, but find in orfheo what you hoped to find. </li></ul></p>',
      list4: '<p>EXPERIENCE <ul><li>Get out of the network: we want to give users the best possible experience over our own internal goals and benefits, so that processes are faster and faster, so you can live in Orfheo only the necessary time and use the information in everyday life. </li><li> We aim to evolve towards an interface and a clean, clear and simple aesthetic, usable by all. </li></ul></p>',
      list5: '<p>ECONOMY <ul><li> You can earn money by being honest and caring and defending the community. With this intention we want to make this project economically sustainable and the lives of those who work on it. </li></ul></p>',
      list6: '<p>VISION <ul><li> We believe that tackling a project should be fun and exciting. We believe that a proper work culture promotes talent and creativity. Team achievements, and individual success contribute to overall success. We have a creative vision of work, leisure and life. </li><li> All the interesting ideas that arise in the most different contexts are discussed, analyzed in depth and if necessary implemented with quality. </li><li> We choose and build collaboratively. Our goal is unity, not unanimity. We make decisions with method, in a genuine way and using consensus. We have open discussions, animated by a process that leads to agreements in a reasonable time. </li><li> We set goals that we know we may not be able to achieve, because we are convinced that along the way, efforts to fulfill them will lead to results, perhaps different from those expected, but equally valuable . </li></ul></p>',
      list7: '<p>MISSION <ul><li> Our mission is to stimulate new cultural possibilities created by connections. </li></ul></p>'
    },
    manager:{
      title: 'Manage',
      toEvent: 'Event page',
      export: 'Export table',
      zeroRecords: "No results",
      infoEmpty: "No information available",
      export: 'Export table',
      copy:{
        helper: 'Create and copy a mailing list',
        table: 'Copy table',
        keys: '<i>ctrl</i> or <i>\u2318</i> + <i>C</i> in order to copy the table data to your clipboard. <br><br>To cancel, click on this message or press Esc.',
        success: '<strong>%d data rows</strong> copied to the clipboard',
        success1: '<strong>1 data row</strong> copied to the clipboard',
        results: ' Results per page _MENU_',
        artistEmails: 'artists emails',
        spaceEmails: 'spaces emails',
        allEmails: 'all emails',
        title: 'Copy emails',
        mex1: '<strong>%{amount} emails copied</strong> to the clipboard',
        mex2: '(<strong><i>Ctrl+V</i></strong> to paste)'
      },
      program:{
        tab: 'Program',
        chain: 'Link the changes',
        unchain: 'Unlink the changes',
        menu: {
          helper: 'Tools menu',
          artistsnoProgram: 'Proposals out of program',
          spacesnoProgram: 'Spaces out of program',
          orderSpaces: 'Order Spaces',
          orderby: 'Order by:'
        },
        publish: 'Publish the program',
        publishmex: 'The program has been successfully published in your event page',
        unpublish: 'Withdraw the program',
        unpublishmex: 'The program has been withdrawn from your event page',
        manageTool: 'Management tool'
      },
      proposals: {
        tab: 'Proposals',
        addAnother: "Add another proposal to a participant you've already created",
        addArtist: 'Create and add an artistic proposal',
        addSpace: 'Create and add a space proposal',
        orNew: '...o create something new',
        byName: "Select by name",
        selectCat: "Select the proposal category",
        phoneL: "Contact phone",
        showFields: 'Show all fields',
        modifyNote1: 'This information, as well as the name, can only be modified by the owner, from the profile page.',
        modifyNote2: 'This information, as well as the name and email, can be changed by modifying any proposal of this artist that you have created.',
        allProposals: 'All proposals',
        artistProposals:'Artistic proposals',
        spaceProposals: 'Space proposals',
        eventCat: 'Category in the event',
        hideShowCol: {
          helper: 'Show/Hide columns', 
          selectAll: "Select everything",
          unselect: 'Unselect everything',
          initial: 'Initial settings'
        },
        table:{
          titleAddress: "Title / Address",
          ages: ''
        }
      },
      tools: {
        tab: 'Tools',
        whitelist: {
          title: 'Enable users to submit a proposal at any time',
          placeholder: 'Email or Profile name',
          ontheList: 'This user is already listed.'
        },
        qr: {
          title: 'Download and distribute the QR code of your event page in orfheo',
          download: 'Download'
        }
      }
    },
    profile_page:{
      aside:{
        yourOther: 'your other profiles',
        other:'Other profiles form same user',
        portfolio:'Portfolio'
      },
      artistBio: 'Biografy',
      call:'Participation in calls',
      callMex:'You are not registered in any active call in this period.',
      multimedia:'Multimedia contents',
      video: 'Videos',
      images: 'Images',
      audio:'Audio',
      spaceInfo: 'Information',
      events: 'Events',
      organizationInfo:'Information',
      createEventBtn:'Create an event and launch a call',
      createEventTitle: 'Your events in orfheo',
      participation:'Participation in events',

      production:{
        cache:'Cache: ',
        public: 'Public ',
        noDuration: "It has no defined duration",
        info: 'Information'
      }
    },
    event_page:{
      infoTab: {
        signupCall:'¡Sign up!',
        callOpening:'Call opening ',
        callOpened:'Open call',
        till: ' untill ',
        callClosed:'Closed cadd (since ',
        organize:'Organizes ',
        noConditions: 'No terms of participation',
        seeAll: 'see all',
        conditions:'Participación terms'
      },
      eventAside:{
        program: 'Program',
        community: 'Community',
        info:'Info',
        partners:'Partners',
        managerbtn:'Event manager',
        withdrawprog:'Withdraw the program',
        publishprog: 'Publish the program',
        withdrawMex:'Now only you can see the program of your event',
        publishMex:'The program has been successfully published',
      },
      program:{
        filtersbtn: 'Filters',
        filters:{
          participants:'Artistic Categories',
          hosts: 'Space Categories',
          other:'Public',
          titleText:'Select what you want to see'
        },
        all_dates: 'All dates',
        nowbtn:'Now',
        hs:'Schedule',
        sp:'Space',
        orderby:'Order by',
        permanents: 'Along all day',
        noResults:'No results'
      }
    },
    cookiesPolicy:{
      title: 'Cookies policy',
      mex: 'In order to improve your browsing experience, orfheo stores information in your browser in the form of small text elements called cookies. </br> If you accept or continue browsing you will be agreeing with this notification. For more information you can read our '
    },
    error: {
      nonExecuted: 'The action could not be executed'
    }
  }
}(Pard || {}))
