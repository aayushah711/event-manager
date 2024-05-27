const Event = require("../models/Event");
const eventValidator = require("../validators/eventValidator");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

exports.createEvent = async (req, res) => {
  try {
    const { error } = eventValidator.validate(req.body);
    if (error) return res.status(400).json({ error: error.details });

    if (req.user.role !== "organizer")
      return res.status(403).json({ error: "Access denied" });

    const { title, date, time, description } = req.body;
    const newEvent = new Event({
      title,
      date,
      time,
      description,
      participants: [],
    });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { error } = eventValidator.validate(req.body);
    if (error) return res.status(400).json({ error: error.details });

    if (req.user.role !== "organizer")
      return res.status(403).json({ error: "Access denied" });

    const { id } = req.params;
    const { title, date, time, description } = req.body;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    event.title = title;
    event.date = date;
    event.time = time;
    event.description = description;
    await event.save();

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    if (req.user.role !== "organizer")
      return res.status(403).json({ error: "Access denied" });

    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    await event.deleteOne();
    res.status(204).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;
    req.user = token ? jwt.verify(token, process.env.API_SECRET || "") : null;
    const userId = req.user?.id;
    if (userId) {
      const eventsWithParticipation = events.map((event) => ({
        ...event.toObject(),
        hasParticipated: event.participants.includes(userId),
      }));
      return res.status(200).json(eventsWithParticipation);
    } else {
      res.status(200).json(events);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (!event.participants.includes(req.user.id)) {
      event.participants.push(req.user.id);
      await event.save();
      // Send confirmation email
      await sendEmail(
        req.user.email,
        "Event Registration Confirmation",
        `You have successfully registered for ${event.title} event!`
      );

      res.status(200).json({ message: "Registered for event" });
    } else {
      res.status(400).json({ error: "Already registered" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ participants: userId });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error });
  }
};
