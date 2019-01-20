import React from 'react'
import { StyleSheet, Text } from 'react-native'

export default function Heading(props) {
  return (
    <Text accessibilityRole="heading" style={[styles.heading, props.style]}>
      {props.children}
    </Text>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'montserrat',
    fontWeight: '400',
    fontSize: '2rem'
  }
})
