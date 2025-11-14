import { router } from 'expo-router'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'

type AvatarPicProps = {
  imageUri?: string
}

export default function AvatarPic({
  imageUri = 'https://avatars.githubusercontent.com/u/128428130?s=400&u=154b02377441fc7a0291585f397c42ec976eebb0&v=4',
}: AvatarPicProps) {
  return (
    <Avatar
      alt="avatar"
      className="size-16"
      onTouchEnd={() => router.push('/profile')}
    >
      <AvatarImage
        source={{
          uri: imageUri,
        }}
      />
    </Avatar>
  )
}
