import React from 'react'
import TabsContentAction from './tabs_content_action/tabsContentAction';
export default function ContentAction() {
  return (
    <div className="flex-1 h-full flex flex-col gap-4">
      <div>
        <TabsContentAction />
      </div>
      <div className="bg-white flex-1 w-full rounded-3xl">
      </div>
    </div>
  )
}