import React from 'react'
import { Link } from 'react-router-dom';
import { Plus } from "lucide-react";
import { Users } from "lucide-react";
import { Bot } from "lucide-react";

function Quickaction() {
  return (
    <section class="quick-actions">
      <div class="action-card">
        <h3>Create a New Class</h3>
        <p>
          Start a new virtual classroom and invite members to join your learning
          community.
        </p>
        <Link to="/create-class" class="btn btn-primary">
          <Plus />
          Create Class
        </Link>
      </div>

      <div class="action-card">
        <h3>Join an Existing Class</h3>
        <p>
          Enter a join code to become part of a class and start learning
          together.
        </p>
        <Link to="/join-class" class="btn btn-secondary">
          <Users />
          Join Class
        </Link>
      </div>

      <div class="action-card">
        <h3>Classmate AI Assistant</h3>
        <p>
          Get AI-powered teaching suggestions and answers instantly to enhance
          your learning experience.
        </p>
        <Link to="/ai-assistant" class="btn btn-accent">
          <Bot/>
          Go to AI Assistant
        </Link>
      </div>
    </section>
  );
}

export default Quickaction