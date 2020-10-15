import React, { FunctionComponent, useEffect, useState } from "react"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Toolbar from "@material-ui/core/Toolbar"
import { createStyles, makeStyles, createMuiTheme, Theme, ThemeProvider  } from "@material-ui/core/styles"
import AddIcon from "@material-ui/icons/Add"
import Typography from "@material-ui/core/Typography"
import Fab from "@material-ui/core/Fab"
import ReturnsList from "./ReturnsList"
import ReturnsForm from "./ReturnsForm"
import * as returnsController from "../returnsController"

interface BaseLayoutProps {
    onLogOutClick: () => void
    userId: string | null
}

const theme = createMuiTheme({
    palette: {
      primary: {    
        main: "#383638",
      },
      secondary: {
        main: "#d66f15",
        contrastText: '#ffffff'
      },
    },
  });   


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        returnsDiv: {
            position: "fixed",
            bottom: 0,
            right: 0,
            marginRight: "20px",
            marginBottom: "20px"
        }
    }),
);

const BaseLayout: FunctionComponent<BaseLayoutProps> = (props: BaseLayoutProps) => {
    const [showReturnsForm, setShowReturnsForm] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [returns, setReturns] = useState<returnsController.IReturn[]>([])
    const classes = useStyles(theme);
    const getNewReturns = async () => {
        const controller: returnsController.Controller = new returnsController.Controller();
        if (props.userId) {
            const data: returnsController.IReturn[] = await controller.getReturns(props.userId)
            setReturns(data)
        }
    }

    useEffect(() => {
        getNewReturns()
    }, [props.userId])

    const toggleReturnsForm = () => {
        setShowReturnsForm(!showReturnsForm)
    }
    return (
        <ThemeProvider theme={theme}>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            My Returns
                        </Typography>
                        <Button color="inherit" onClick={() => props.onLogOutClick()}>Log Out</Button>
                    </Toolbar>
                </AppBar>
            </div>
            <div>
                {<ReturnsList returns={returns} getNewReturnsList={getNewReturns}/>}
            </div>
            <div className={classes.returnsDiv}>
                {
                    !showReturnsForm &&
                    <Fab color="secondary" aria-label="add" onClick={() => toggleReturnsForm()}>
                        <AddIcon />
                    </Fab>
                }
                {
                    showReturnsForm && <ReturnsForm  userId={props.userId} toggleReturnsForm={toggleReturnsForm} getNewReturnsList={getNewReturns}/>
                }
            </div>
        </ThemeProvider>
    )
}

export default BaseLayout