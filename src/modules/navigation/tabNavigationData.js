// import Home from '../home/Home';
// import Search from '../search/Search';
// import Saved from '../saved/Saved';
// import Account from '../account/Account'
// import NavigatorView from './RootNavigation' 
// import SearchLocality from '../search/SearchLocality';

import Community from "../Community/Community";
import Search from "../Search/Search";
import Splash from "../Splash/Splash";
import Home from "../home/Home";
import Profile from "../profile/Profile";
import ChatList from "../Matrimony/chat/ChatList";
import MatrimonyListing from "../Matrimony/MatrimonyListing";


const homeIcon = require('@images/home.png');
const searchIcon = require('@images/search.png');
const groupIcon = require('@images/group.png');
const userIcon = require('@images/user.png');
const menuIcon = require('@images/menu.png')
const chatIcon = require("@images/chat.png");
// const heartIcon = require('@images/heart.png');
// const accountIcon = require('@images/account.png');




const tabNavigationData = [
  {
    name: 'Matrimony',
    component: Home,
    icon: homeIcon,
  },
  {
    name: 'Chat',
    component: ChatList,
    icon: chatIcon,
  },
  {
    name: 'Community',
    component: Community,
    icon: groupIcon,
  },
  {
    name: 'Menu',
    component: Profile,
    icon: menuIcon,
  },
  // {
  //   name:"Search",
  //   component: SearchLocality,
  //   icon: searchIcon,
  // },
  // {
  //   name:"Saved",
  //   component:Saved,
  //   icon: heartIcon,
  // },
  // {
  //   name:"Account",
  //   component:Account,
  //   icon: accountIcon,
  // }
  
];

export default tabNavigationData;