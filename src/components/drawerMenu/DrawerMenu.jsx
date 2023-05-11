import React, {useState} from 'react'
import {Button, Drawer, List} from '@mui/material'


const DrawerMenu = () => {
    const [open, setOpen] = useState(false);
    const courses = ['Reactjs', 'Nodejs', 'Mongdb', 'Mern']

    return(
        <>
            <div>
                <Button vaiant='contained' onClick={() => setOpen(true)}>Open</Button>
                <Drawer open={open} onClose={() => setOpen(false)}>
                    <List>
                        {
                            courses.map(course => (
                                <ListItemButton onClick={() => setOpen(false)}>
                                    <ListItemText primary={courses}/>
                                </ListItemButton>
                            ))
                        }
                    </List>
                </Drawer>
            </div>
        </>
    )

}