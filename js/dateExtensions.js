
// Returns a date in the format "YYYY-MM-DD".
Date.prototype.simpleDateString = function() {
    function pad(value)
    {
        return ("0" + value).slice(-2);
    }

    var dateString = this.getFullYear() + "-" +
            pad(this.getMonth() + 1, 2) + '-' +
            pad(this.getDate(), 2);

    return dateString;
}

// Date format required by darksky.net API.
// We always represent a date with a time of midday,
// so our choice of day isn't susceptible to time zone errors.
Date.prototype.darkSkyDateString = function() {
    return this.simpleDateString() + "T12:00:00";
}
