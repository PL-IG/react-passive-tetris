import * as React from 'react'

export default (storyFn: () => React.ReactNode) => <div style={
    {
        padding: 0,
        textAlign: 'center',
        backgroundColor: 'black',
        color: 'white',
        height: '90vh',
        width: '100%',
        flexGrow: 1
    }
}>{storyFn()}</div>
