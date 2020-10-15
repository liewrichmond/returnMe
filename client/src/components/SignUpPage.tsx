import React, {useState} from "react"
import logo from "../static/img/logo.png"
import Card from '@material-ui/core/Card';
import { Button, TextField } from "@material-ui/core";
import FormHelperText from '@material-ui/core/FormHelperText';

interface SignUpPageProps {
    
}

const SignUpPage: React.FC<SignUpPageProps> = (props: SignUpPageProps) => {
    const [usernameValue, setUsernameValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")
    const [helperText, setHelperText] = useState("")
    const [formError, setFormError] = useState(false)

    const handleSignUp = () => {

    }

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


    return (
        <Card className="loginCard">
            <img src={logo} />
            <div className="loginForm">
                <form>
                    <div className="loginField">
                        <TextField id="username" error={formError} label="Username" variant="outlined" value={usernameValue} onChange={handleChange} required={true} fullWidth={true} />
                    </div>
                    <div className="loginField">
                        <TextField id="password" error={formError} label="Password" type="password" variant="outlined" value={passwordValue} onChange={handleChange} required={true} fullWidth={true} />
                        <FormHelperText error={formError}>{helperText}</FormHelperText>
                    </div>
                    <div className="loginButton">
                        <Button variant="contained" color="primary" onClick={handleSignUp}>
                            Sign Up
                        </Button>

                    </div>
                </form>
            </div>
        </Card>
    )
}

export default SignUpPage