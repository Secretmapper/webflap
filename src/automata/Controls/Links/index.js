import React, { useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import useHover from '../../../core/hooks/useHover'

function Links() {
  const sourceCodeRef = useRef(null)
  const sourceCodeHover = useHover(sourceCodeRef)

  const issueRef = useRef(null)
  const issueHover = useHover(issueRef)

  return (
    <View>
      <View ref={sourceCodeRef} style={styles.linkContainer}>
        <Text
          style={[styles.link, sourceCodeHover && styles.linkHover]}
          accessibilityRole="link"
          target="_blank"
          href="//github.com/Secretmapper/webflap"
        >
          Source code
        </Text>
      </View>
      <View ref={issueRef} style={[styles.linkContainer, styles.linkBottom]}>
        <Text
          style={[styles.link, issueHover && styles.linkHover]}
          accessibilityRole="link"
          target="_blank"
          href="//github.com/Secretmapper/webflap/issues"
        >
          Report issues
        </Text>
      </View>
      <View>
        <Text style={styles.authorLinkContainer}>
          <Text>Made by </Text>
          <Text
            style={styles.authorLink}
            accessibilityRole="link"
            target="_blank"
            href="//twitter.com/Secretmapper"
          >
            @secretmapper
          </Text>
        </Text>
      </View>
    </View>
  )
}

export default Links

const styles = StyleSheet.create({
  linkContainer: {
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    borderTopWidth: 1
  },
  linkBottom: {
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1
  },
  link: {
    fontFamily: 'montserrat',
    fontSize: 13,
    borderRadius: 3,
    color: '#818387',
    display: 'block',
    marginLeft: -10,
    marginRight: -10,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 8
  },
  linkHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    color: 'black'
  },
  authorLinkContainer: {
    paddingBottom: 10,
    paddingTop: 10
  },
  authorLink: {
    color: '#71BCF7'
  },
  navLink: {
    paddingBottom: 4,
    marginBottom: 4
  }
})
