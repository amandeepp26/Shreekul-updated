import { colors, fonts } from "../../styles";
import TabNavigator from "./MainTabNavigator";
import MatrimonyRegistration from "../Matrimony/Registration/MatrimonyRegistration";
import Pricing from "../Matrimony/Pricing";
import Search from "../Matrimony/Search";
import MatrimonySearch from "../Matrimony/Search";
import MatrimonyListing from "../Matrimony/MatrimonyListing";
import ChatList from "../Matrimony/chat/ChatList";
import ChatBox from "../Matrimony/chat/ChatBox";
import ProfileDetail from "../Matrimony/ProfileDetail";
import Liked from "../Matrimony/Liked";
import EditProfile from "../profile/EditProfile";
import AboutUs from "../profile/AboutUs";
import PrivacyPolicy from "../profile/PrivacyPolicy";
import EditMatrimonyProfile from "../Matrimony/Profile/EditMatrimonyProfile";
import ChangePhone from "../profile/ChangePhone";
import Otp from "../auth/Verify-otp";
import ReverifyOtp from "../profile/ReverifyOtp";
import EditOtherDetails from "../Matrimony/Profile/EditOtherDetails";
import MyFamily from "../Matrimony/Family/MyFamily";
import AddMember from "../Matrimony/Family/AddMember";
import EditMember from "../Matrimony/Family/EditMember";
import Shortlist from "../Matrimony/Shortlist";
import ChangeEmail from "../profile/ChangeEmail";

// const headerLeftComponent = (props) => {
//   return (
//     <TouchableOpacity
//       onPress={props.onPress}
//       style={{
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//       }}
//     >
//       <Image
//         source={require('../../../assets/images/settings.png')}
//         resizeMode="contain"
//         style={{
//           width: 22,
//           height: 22,
//           tintColor: '#1F1F1F',
//         }}
//       />
//     </TouchableOpacity>
//   )
// }


const StackNavigationData = [
  {
    name: "Home",
    component: TabNavigator,
    headerLeft: null,
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: "MatrimonySubscription",
    component: MatrimonyRegistration,
  },
  {
    name: "Pricing",
    component: Pricing,
  },
  {
    name: "MatrimonySearch",
    component: MatrimonySearch,
  },
  {
    name: "MatrimonyListing",
    component: MatrimonyListing,
  },
  {
    name: "ChatList",
    component: ChatList,
  },
  {
    name: "ChatBox",
    component: ChatBox,
  },
  {
    name: "ProfileDetail",
    component: ProfileDetail,
  },
  {
    name: "Liked",
    component: Liked,
  },
  {
    name: "Shortlist",
    component: Shortlist,
  },
  {
    name: "EditProfile",
    component: EditProfile,
  },
  {
    name: "AboutUs",
    component: AboutUs,
  },
  {
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
  },
  {
    name: "EditMatrimonyProfile",
    component: EditMatrimonyProfile,
  },
  {
    name: "ChangePhone",
    component: ChangePhone,
  },
  {
    name: "ChangeEmail",
    component: ChangeEmail,
  },
  {
    name: "ReverifyOtp",
    component: ReverifyOtp,
  },
  {
    name: "EditOtherDetails",
    component: EditOtherDetails,
  },
  {
    name: "MyFamily",
    component: MyFamily,
  },
  {
    name: "AddMember",
    component: AddMember,
  },
  {
    name: "EditMember",
    component: EditMember,
  },
];

export default StackNavigationData;
