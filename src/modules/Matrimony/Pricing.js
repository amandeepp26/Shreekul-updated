import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../styles";
import styles from "../navigation/styles";
import Button from "../../components/Button";
import { Icon } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import apiClient from "../../utils/apiClient";

export default function Pricing({ navigation }) {
  const route = useRoute();
  const { register } = route.params;
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.session.authToken);
  const profile = useSelector((state) => state.session.profile);

  const purchase = async () => {
    try {
      const orderData = await apiClient.post(apiClient.Urls.initiatePayment, {
        amount: 999,
      });

      console.log("order data======================>", orderData);

      if (!orderData) {
        return;
      }

      const options = {
        description: "Credits towards consultation",
        image: profile.profile_image,
        currency: "INR",
        key: "rzp_test_cAVlu867tStyfm", // Your api key
        amount: orderData.data.amount.toString(),
        name: profile.fullname,
        order_id: orderData.data.id,
        prefill: {
          email: profile.email,
          contact: profile.phone,
          name: "Matrimony Subscription",
        },
        theme: { color: colors.primaryColor },
      };

      const paymentResponse = await new Promise((resolve) => {
        RazorpayCheckout.open(options, (response) => {
          resolve(response);
        });
      });

      if (paymentResponse.razorpay_payment_id) {
        // Send the razorpay_payment_id to your server for verification
        const verifyData = {
          razorpay_order_id: orderData.data.id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          authToken: token,
        };

        const verifyResponse = await apiClient.post(
          apiClient.Urls.verifyPayment,
          verifyData
        );
        console.warn("verify payment response---->", verifyResponse);
        // This is a function for matrimony registration
        register();
      } else {
        Toast.show({
          text1: paymentResponse.message || "Payment failed!",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error===========>", error);
    }
  };
  return (
    <View style={style.container}>
      <View style={style.circle}></View>
      <View
        style={{
          borderWidth: 1,
          width: 70,
          paddingHorizontal: 10,
          paddingVertical: 3,
          borderRadius: 100,
          borderColor: "#d3d3d3",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Text style={[styles.p, { fontWeight: "700" }]}>Pricing</Text>
      </View>
      <View>
        <Text style={style.pricingText}>₹ 999/-</Text>
        <Text style={[styles.h6, { fontWeight: "600", paddingLeft: 5 }]}>
          Per User Per Month
        </Text>
      </View>
      <View style={{ paddingTop: 20 }}>
        {loading ? (
          <Button load={true} backgroundColor={colors.primaryColor} />
        ) : (
          <Button
            text={"Purchase Plan"}
            backgroundColor={colors.primaryColor}
            onpress={() => purchase()}
          />
        )}
      </View>
      <View style={{ paddingVertical: 20 }}>
        <Text style={[styles.h6]}>Includes :</Text>
        <View style={style.infoText}>
          <Icon
            name="checkmark-circle-outline"
            type="ionicon"
            color={colors.black}
            size={22}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.p, { color: "#000" }]}>
            Unlimited profile access
          </Text>
        </View>
        <View style={style.infoText}>
          <Icon
            name="checkmark-circle-outline"
            type="ionicon"
            color={colors.black}
            size={22}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.p, { color: "#000" }]}>Priority matching</Text>
        </View>
        <View style={style.infoText}>
          <Icon
            name="checkmark-circle-outline"
            type="ionicon"
            color={colors.black}
            size={22}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.p, { color: "#000" }]}>Enhanced visibility</Text>
        </View>
        <View style={style.infoText}>
          <Icon
            name="checkmark-circle-outline"
            type="ionicon"
            color={colors.black}
            size={22}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.p, { color: "#000" }]}>Instant messaging</Text>
        </View>
        <View style={style.infoText}>
          <Icon
            name="checkmark-circle-outline"
            type="ionicon"
            color={colors.black}
            size={22}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.p, { color: "#000" }]}>
            Advanced search filters
          </Text>
        </View>
        <View style={style.infoText}>
          <Icon
            name="checkmark-circle-outline"
            type="ionicon"
            color={colors.black}
            size={22}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.p, { color: "#000" }]}>Verified profiles</Text>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 35,
  },
  circle: {
    height: 220,
    width: 200,
    backgroundColor: "#f5d142",
    borderRadius: 70,
    position: "absolute",
    top: -60,
    right: -70,
  },
  pricingText: {
    fontSize: 70,
    fontWeight: "600",
    color: colors.gray,
    paddingTop: 35,
  },
  infoText: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
  },
});
