import React from 'react'
export default function LandingShell({theme, children}) {
  return <div className="landing-root" style={theme}>{children}</div>
}
