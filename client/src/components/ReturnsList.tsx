import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { IReturn, Handler, Controller } from "../returnsController"
import Card from '@material-ui/core/Card';
import DeleteIcon from '@material-ui/icons/Delete';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import amazon_logo from "../static/img/amazon_logo.jpg"
import ups_logo from "../static/img/ups_logo.png"
import usps_logo from "../static/img/usps_logo.png"
import { Grid } from "@material-ui/core";

interface ReturnsListProps {
    returns: IReturn[]
    getNewReturnsList: () => void;
}

interface IReturnsCardProps {
    returns: IReturn,
    getNewReturnsList: () => void;
}

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    card_root: {
        width: "18vw",
    },
    media: {
        height: 140,
    },
    mainGrid: {
        width: "100%",
        minHeight: "100vh",
        paddingTop: "2rem"
    }
});


const ReturnsList: React.FC<ReturnsListProps> = (props: ReturnsListProps) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Grid container spacing={3} className={classes.mainGrid}>
                {props.returns.map((value, index) => {
                    return (
                        <Grid item>
                            <MediaCard key={index} returns={value} getNewReturnsList={props.getNewReturnsList}></MediaCard>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    )
}

const MediaCard: React.FC<IReturnsCardProps> = (props: IReturnsCardProps) => {
    const classes = useStyles();
    let logo: any = null;
    switch (props.returns.handler) {
        case Handler.Amazon: {
            logo = amazon_logo
            break;
        }
        case Handler.USPS: {
            logo = usps_logo;
            break;
        }   
        case Handler.UPS: {
            logo = ups_logo;
            break;
        }
    }

    const handleDeleteReturnsClick = async () => {
        const controller: Controller = new Controller();
        await controller.deleteReturn(props.returns);
        props.getNewReturnsList()
    }

    const formatDate = ():string => {
        const startDate = new Date(props.returns.startDate);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(startDate)
    }

    return (
        <Card className={classes.card_root}>
            <CardMedia
                className={classes.media}
                title="Contemplative Reptile"
                image={logo}
            />
            <CardContent>
                <Grid container direction="column">
                    <Grid item>
                        <Typography gutterBottom variant="h5" component="h2">
                            {props.returns.handler}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Status: {props.returns.status}
                            </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Pickup Date: {formatDate()}
                            </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button onClick={handleDeleteReturnsClick}><DeleteIcon /></Button>
            </CardActions>
        </Card>
    );
}

export default ReturnsList