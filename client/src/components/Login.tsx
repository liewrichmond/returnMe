import React, { useState } from "react"
import { Button, TextField, Typography } from "@material-ui/core";
import FormHelperText from '@material-ui/core/FormHelperText';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import logo from "../static/img/logo.png"
import { makeStyles } from "@material-ui/core/styles"
import {Controller, User} from "../loginController"
import Grid from "@material-ui/core/Grid"
import "../css/main.css"

export interface ILoginState {
    usernameValue: string,
    passwordValue: string
}
export interface ILoginProps {
    // isAuthenticated: boolean,
    onSubmissionClick: (username: string, password: string) => Promise<boolean>
    onSignUpClick: () => void
}

const useStyles = makeStyles({
    logoStyle: {
        marginLeft: "auto",
        marginRight: "auto",
    },
    loginField: {
        width: "20vw",
        marginTop: "10px",
    },
    signUpButton: {
        marginLeft: "20px"
    },
    buttons: {
        marginTop: "10px",
        marginBottom: "20px",
    }
});

const Login: React.FC<ILoginProps> = (props: ILoginProps) => {
    const [usernameValue, setUsernameValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")
    const [helperText, setHelperText] = useState("")
    const [formError, setFormError] = useState(false)
    const classes = useStyles()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault;
        const elementId = event.target.id
        setFormError(false)
        setHelperText("")
        if (elementId === "username") {
            setUsernameValue(event.target.value)
        }
        if (elementId === "password") {
            setPasswordValue(event.target.value)
        }
    }

    const submitForm = async () => {
        setFormError(await props.onSubmissionClick(usernameValue, passwordValue));
        if (!formError) {
            setFormError(true)
            setHelperText("Invalid username and password combination. Have you signed up yet?")
        }
    }

    const createNewUser = async() => {
        const controller : Controller = new Controller();
        const newUser : User = {
            username: usernameValue,
            password: passwordValue,
        }
        const success:boolean = await controller.createUser(newUser)
        if(!success) {
            setFormError(true)
            setHelperText("Username is taken!")
        }
        else {
            submitForm()
        }
    }

    return (
        <Box style={{width: "50vw", background:"white"}} boxShadow={5}>
            <Grid container direction="column" alignItems="center" justify="center">
                <Grid item>
                    <img src={logo} />
                </Grid>
                <Grid item>
                    <form>
                        <div className={classes.loginField}>
                            <TextField id="username" error={formError} label="Username" variant="outlined" value={usernameValue} onChange={handleChange} required={true} fullWidth={true} />
                        </div>
                        <div className={classes.loginField}>
                            <TextField id="password" error={formError} label="Password" type="password" variant="outlined" value={passwordValue} onChange={handleChange} required={true} fullWidth={true} />
                            <FormHelperText error={formError}>{helperText}</FormHelperText>
                        </div>
                        <Grid container direction="row" alignItems="center" justify="center" className={classes.buttons}>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={submitForm}>
                                        Log In
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary" className={classes.signUpButton} onClick={createNewUser}>
                                        Sign Up
                                    </Button>
                                </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Box>
    )
}


export default Login