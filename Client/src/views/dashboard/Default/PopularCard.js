import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { makeStyles } from '@material-ui/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@material-ui/core';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from './../../../ui-component/cards/MainCard';
import SkeletonPopularCard from './../../../ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from './../../../store/constant';

// assets
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import { useEffect, useState } from 'react';
import CryptoPriceProvider from './CryptoPriceProvider';
import { LocalLaundryServiceSharp } from '@material-ui/icons';

// style constant
const useStyles = makeStyles((theme) => ({
    cardAction: {
        padding: '10px',
        paddingTop: 0,
        justifyContent: 'center'
    },
    primaryLight: {
        color: theme.palette.primary[200],
        cursor: 'pointer'
    },
    divider: {
        marginTop: '12px',
        marginBottom: '12px'
    },
    avatarSuccess: {
        width: '16px',
        height: '16px',
        borderRadius: '5px',
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.dark,
        marginLeft: '15px'
    },
    successDark: {
        color: theme.palette.success.dark
    },
    avatarError: {
        width: '16px',
        height: '16px',
        borderRadius: '5px',
        backgroundColor: theme.palette.orange.light,
        color: theme.palette.orange.dark,
        marginLeft: '15px'
    },
    errorDark: {
        color: theme.palette.orange.dark
    }
}));

//-----------------------|| DASHBOARD DEFAULT - POPULAR CARD ||-----------------------//

const PopularCard = ({ isLoading }) => {
    const classes = useStyles();
    const [error, setError] = useState(null);
    const [marketData, setMarketData] = useState({});

    const [priceData, setPriceData] = useState({});
    const [hourlyData, setHourlyChange] = useState({});
    const [weeklyData, setWeeklyChange] = useState({});
    // const [CryptoStatusPerDay, setCryptoStatusPerDay] = useState({});
    const [anchorEl, setAnchorEl] = React.useState(null);
    const cryptoIds = ['bitcoin', 'ethereum', 'ripple'];
const id =0;
    useEffect(() => {
        CryptoPriceProvider.getPriceData(cryptoIds)

            .then((data) => setPriceData(data))
            .catch((error) => setError('Failed to load price data'));

            cryptoIds.forEach(id => {
                CryptoPriceProvider.getMarketData(id)
                  .then((data) => {
                    setMarketData(prevData => ({
                      ...prevData,
                      [id]: data
                    }));
                  })
                  .catch((error) => setError('Failed to load market data'));
              });
    }, []);



    const calculateImpact = (data, interval) => {
        if (!data || data.prices.length === 0) return null;
        const latestPrice = data.prices[data.prices.length - 1][1];
        const pastPrice = interval === 'hourly' ? data.prices[data.prices.length - 2][1] : data.prices[0][1];
        const impact = ((latestPrice - pastPrice) / pastPrice) * 100;
        return impact.toFixed(2);
      };




    
    console.log(priceData);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">Popular Cryptos</Typography>
                                    </Grid>
                                    <Grid item>
                                        <MoreHorizOutlinedIcon
                                            fontSize="small"
                                            className={classes.primaryLight}
                                            aria-controls="menu-popular-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        />
                                        <Menu
                                            id="menu-popular-card"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            variant="selectedMenu"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                        >
                                            <MenuItem onClick={handleClose}> This Hour</MenuItem>
                                            <MenuItem onClick={handleClose}> Today</MenuItem>
                                            <MenuItem onClick={handleClose}> This Month</MenuItem>
                                            <MenuItem onClick={handleClose}> This Year </MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ pt: '16px !important' }}>
                                <BajajAreaChartCard />
                            </Grid>
                            {cryptoIds.map((id) => (
                                <Grid item xs={12} key={id}>
                                    {priceData[id] && priceData[id].usd ? (
                                        <>
                                            <Grid container direction="column">
                                                <Grid item>
                                                    <Grid container alignItems="center" justifyContent="space-between">
                                                        <Grid item>
                                                            <Typography variant="subtitle1" color="inherit">
                                                                {id.toUpperCase()}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Grid container alignItems="center" justifyContent="space-between">
                                                                <Grid item>
                                                                    <Typography variant="subtitle1" color="inherit">
                                                                        ${priceData[id].usd.toFixed(2)}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Avatar variant="rounded" className={classes.avatarSuccess}>
                                                                        <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                                                                    </Avatar>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle2" className={classes.successDark}>
                                                        {priceData[id].usd_24h_change.toFixed(2)}%{' '}
                                                        {priceData[id].usd_24h_change > 0 ? 'Profit' : 'Loss'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                  <Typography variant="subtitle2" color="inherit">
                    Hourly Impact: 
                    {marketData[id] ? calculateImpact(marketData[id], 'hourly') + '%' : 'Loading...'}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2" color="inherit">
                    Weekly Impact: 
                    {marketData[id] ? calculateImpact(marketData[id], 'weekly') + '%' : 'Loading...'}
                  </Typography>
                </Grid>
                                            </Grid>
                                            <Divider className={classes.divider} />
                                        </>
                                    ) : (
                                        'Loading...'
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                    <CardActions className={classes.cardAction}>
                        <Button size="small" disableElevation>
                            View All
                            <ChevronRightOutlinedIcon />
                        </Button>
                    </CardActions>
                </MainCard>
            )}
        </React.Fragment>
    );
};

PopularCard.propTypes = {
    isLoading: PropTypes.bool
};

export default PopularCard;
