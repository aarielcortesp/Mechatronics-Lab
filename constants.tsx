
import { Component } from './types';

export const COMPONENT_CATALOG: Component[] = [
  {
    id: 'ard-uno',
    name: 'Arduino Uno R3',
    category: 'controller',
    description: 'Universal 8-bit microcontroller board.',
    specifications: { 'Voltage': '5V', 'I/O Pins': '14 Digital, 6 Analog', 'Clock': '16MHz' },
    cost: 25.00,
    image: 'https://picsum.photos/seed/arduino/200/200'
  },
  {
    id: 'servo-mg996r',
    name: 'Servo MG996R',
    category: 'actuator',
    description: 'High torque metal gear servo motor.',
    specifications: { 'Torque': '11kg/cm', 'Speed': '0.17s/60deg', 'Voltage': '4.8V - 7.2V' },
    cost: 12.50,
    image: 'https://picsum.photos/seed/servo/200/200'
  },
  {
    id: 'sensor-ultra',
    name: 'HC-SR04 Ultrasonic',
    category: 'sensor',
    description: 'Distance measurement sensor.',
    specifications: { 'Range': '2cm - 400cm', 'Resolution': '0.3cm', 'Angle': '15 deg' },
    cost: 4.00,
    image: 'https://picsum.photos/seed/ultra/200/200'
  },
  {
    id: 'dc-pump',
    name: '12V DC Water Pump',
    category: 'actuator',
    description: 'Miniature submersible water pump.',
    specifications: { 'Flow Rate': '240L/H', 'Head': '3m', 'Current': '400mA' },
    cost: 8.00,
    image: 'https://picsum.photos/seed/pump/200/200'
  }
];
