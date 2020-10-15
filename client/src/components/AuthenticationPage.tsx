import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Login from "./Login"

interface AuthenticationPageProps {
    onSubmissionClick: (username: string, password: string) => Promise<boolean>
}

const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
        overflow: "hidden"
    },
    background: {
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
    }
})


const AuthenticationPage: React.FC<AuthenticationPageProps> = (props: AuthenticationPageProps) => {
    const [loggingIn, setLoggingIn] = useState(true)
    const [signingUp, setSigningUp] = useState(false)
    const classes = useStyles()

    const onSignUpClick = () => {
        setLoggingIn(false);
        setSigningUp(true);
    }
    return (
        <div className={classes.background}>
            <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
                className={classes.root}
            >
                <Grid item>
                    {loggingIn && <Login onSubmissionClick={props.onSubmissionClick} onSignUpClick={onSignUpClick} />}
                </Grid>

            </Grid>
        </div>
    )
}

export default AuthenticationPage