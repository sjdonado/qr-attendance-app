const QRCode = require('qrcode');
const { ApolloError } = require('apollo-server');
const moment = require('moment');
const { authentication } = require('../../services/auth');
const { sendQRCodeEmail } = require('../../services/mailer');
const { generateQRCodeKey } = require('../../services/encrypt');

const sendInvitations = async(parent, { eventId }, context) => {
    const user = await authentication(context);

    const eventIdx = user.events.findIndex((event) => event.id === eventId);
    if (eventIdx === -1) {
        throw new ApolloError('Event not found', 404);
    }

    const event = user.events[eventIdx];

    await Promise.all(event.attendance.map(async(attendee) => {
        const url = await QRCode.toDataURL(generateQRCodeKey(event.id, attendee.id));

        if (!attendee.invited) {
            const eventInfo = {
                name: event.name,
                description: event.description,
                location: event.location,
                startDate: moment(event.startDate).format('MMMM Do YYYY, h:mm a'),
                endDate: moment(event.endDate).format('MMMM Do YYYY, h:mm a'),
            };
            const res = await sendQRCodeEmail(url, user.name, eventInfo, attendee.email);

            if (res) {
                Object.assign(attendee, { invited: true });
            }
        }
    }));

    await user.save();

    return event;
};

module.exports = sendInvitations;