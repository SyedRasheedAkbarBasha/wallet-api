// import React, { Component } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {COLORS} from "@/constants/color.js"
const safeScreen =({children})=> {
  const insets = useSafeAreaInsets();
    return (
      <View style={{paddingTop:insets.top,flex:1,backgroundColor:COLORS.background}}>
        {children}
      </View>
    )
  }


export default safeScreen
