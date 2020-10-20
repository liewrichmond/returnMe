import React, { useState } from "react"
import { Handler } from "../returnsController"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button"
import SendIcon from '@material-ui/icons/Send';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid"
import { Controller, IReturn, DeliveryStatus } from "../returnsController"
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { setDate } from "date-fns/esm";

interface RetrunsFormProps {
    userId: string | null;
    toggleReturnsForm: () => void;
    getNewReturnsList: () => void;
}

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        padding: "20px",
        width: "20vw"
    },
    sendButton: {
        marginTop: "20px",
    },
})

const ReturnsForm: React.FC<RetrunsFormProps> = (props: RetrunsFormProps) => {
    const classes = useStyles();
    const [handler, setHandler] = useState<Handler>();
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [formError, setFormError] = useState(true);
    const [helperText, setHelperText] = useState("Choose Delivery Handler")
    const [dateError, setDateError] = useState(false)

    const handleHandlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        switch ((event.target as HTMLInputElement).value) {
            case "Amazon": {
                setHandler(Handler.Amazon);
                break;
            }
            case "UPS": {
                setHandler(Handler.UPS);
                break;
            }
            case "USPS": {
                setHandler(Handler.USPS);
                break;
            }
            default:
                setHandler(undefined);
        }
        setHelperText("")
        setFormError(false)
    };

    const minSelectableDate: Date = new Date()
    const maxSelectableDate = getMaxSelectableDate()

    function getMaxSelectableDate(): Date {
        const today = new Date()
        const oneMonthAway = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
        return oneMonthAway
    }

    const handleDateChange = (date: Date | null) => {
        if(date){
            if(date > minSelectableDate && date < maxSelectableDate) {
                setDateError(false)
                setSelectedDate(date);
            }
            else {
                setDateError(true)
            }
        }
        else {
            setDateError(true)
        }
    };
    const handleCreateReturnsClick = async () => {
        if (formError || !handler || dateError) {
            setHelperText("Please Choose One");
        }
        else {
            if (!props.userId || !selectedDate) {
                setFormError(true);
                setHelperText("Invalid Arguments!");
            } else {
                const newReturn: IReturn = {
                    userId: props.userId,
                    handler: handler,
                    startDate: selectedDate,
                    status: DeliveryStatus.InProgress
                }
                const returnsController = new Controller();
                await returnsController.createReturn(newReturn)
                props.toggleReturnsForm();
                props.getNewReturnsList();
            }
        }
    }
    const handleClickAway = () => {
        setFormError(true)
        props.toggleReturnsForm()
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Paper elevation={3} className={classes.root}>
                <Grid container direction="row">
                    <Grid item>
                        <FormControl component="fieldset" error={formError}>
                            <FormLabel component="legend">Handler</FormLabel>
                            <RadioGroup name="handlerSelector" value={handler} onChange={handleHandlerChange}>
                                <FormControlLabel value={Handler.Amazon} control={<Radio />} label={Handler.Amazon} />
                                <FormControlLabel value={Handler.UPS} control={<Radio />} label={Handler.UPS} />
                                <FormControlLabel value={Handler.USPS} control={<Radio />} label={Handler.USPS} />
                            </RadioGroup>
                            <FormHelperText>{helperText}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Grid container direction="column">
                            <Grid item>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="dialog"
                                        format="MM/dd/yyyy"
                                        margin="dense"
                                        label="Pick-up date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        minDate={minSelectableDate}
                                        maxDate = {maxSelectableDate}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" type="submit" color="secondary" endIcon={<SendIcon />} className={classes.sendButton} onClick={handleCreateReturnsClick}>
                                    Create Return
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </ClickAwayListener>
    )
}

export default ReturnsForm