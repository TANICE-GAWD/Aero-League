import * as React from "react"
import './ui.css'

function Card({
  className = "",
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={`card ${className}`.trim()}
      {...props}
    />
  );
}

function CardHeader({
  className = "",
  ...props
}) {
  const hasAction = React.Children.toArray(props.children).some(
    child => child?.props?.['data-slot'] === 'card-action'
  );
  
  return (
    <div
      data-slot="card-header"
      className={`card-header ${hasAction ? 'has-action' : ''} ${className}`.trim()}
      {...props}
    />
  );
}

function CardTitle({
  className = "",
  ...props
}) {
  return (
    <div
      data-slot="card-title"
      className={`card-title ${className}`.trim()}
      {...props}
    />
  );
}

function CardDescription({
  className = "",
  ...props
}) {
  return (
    <div
      data-slot="card-description"
      className={`card-description ${className}`.trim()}
      {...props}
    />
  );
}

function CardAction({
  className = "",
  ...props
}) {
  return (
    <div
      data-slot="card-action"
      className={`card-action ${className}`.trim()}
      {...props}
    />
  );
}

function CardContent({
  className = "",
  ...props
}) {
  return (
    <div 
      data-slot="card-content" 
      className={`card-content ${className}`.trim()} 
      {...props} 
    />
  );
}

function CardFooter({
  className = "",
  hasBorder = false,
  ...props
}) {
  return (
    <div
      data-slot="card-footer"
      className={`card-footer ${hasBorder ? 'has-border' : ''} ${className}`.trim()}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
