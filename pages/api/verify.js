import { ethers } from 'ethers';

const users = [];

export default async function verifySignature(req, res) {
  if (!req.body.message || !req.body.signature) {
    return res.status(400).send({ error: 'Missing message or signature' });
  }
  const { address, signature, message } = req.body;
  const decodedAddress = ethers.utils.verifyMessage(message, signature);
  if (decodedAddress.toLowerCase() === address.toLowerCase()) {
    let user = users.find(u => u.address = address.toLowerCase());
    if (!user) {
      user = { address: address.toLowerCase(), createdAt: new Date() };
      users.push(user);
    };
    return res.status(200).json({ user, verified: true });
  }
  res.status(200).json({ decodedAddress, verified: false });
}