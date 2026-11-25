# Engineering guidelines

These rules come from a long review history on a production-shaped
application. They describe structure, not a framework or a product. Apply them
wherever an application has effects, models, and a view layer.

## 1. Put effects at the edge and decisions in pure code

- An effectful boundary (a controller, handler, or adapter) loads, parses, and
  serializes. It does not decide which view a user sees.
- A pure factory takes the loaded values and decides the model: ready, empty,
  missing, failed.
- If a controller contains a branch on domain validity, absence, or a business
  rule, that branch belongs in a factory.
- Keep factories synchronous. If a factory needs to load something, the
  boundary is wrong.

## 2. A factory owns its model

- A model and its constructor live together.
- A child model owns its own factory. A parent composes children; it does not
  assemble their fields.
- Pass whole values: domain objects, parsed input records, parameter objects.
  Do not pass fragments or already-derived fields.
- If a caller has to build part of a model, the factory is incomplete.
- Currying helps when the same context repeats:
  `factory(dependencies, step)(input)`. Use it to remove repetition, not to
  hide inputs.
- A growing argument list becomes a named input object.

## 3. Encode states, not possibilities

- Mutually exclusive states are a tagged union. State-specific fields live in
  their variant.
- Do not model exclusive states with optional fields or independent booleans.
- Absence is an explicit value. Keep it until the last responsible moment, in
  the factory or view that consumes it. Convert to the wire shape only at the
  boundary that requires it.
- Match exhaustively. Adding a state should break every handler until each is
  considered.
- Use named constants for closed sets of literals (actions, kinds, keys). A
  raw string in logic is a typo waiting to happen.
- Validate untrusted input once at the boundary; downstream code trusts the
  parsed value.

## 4. Dependencies arrive; they are not discovered

- Define a port for each external capability. Domain code depends on the port.
- The composition root builds concrete adapters, once, and hands them to the
  application.
- Do not import a singleton client deep in the code. If a test cannot replace
  it, it is hidden.
- When a framework boundary loses the request context, bridge it once, at that
  boundary, with a typed value. Keep the bridge small.
- Tests provide stubs at the same seam that production provides adapters.
- A service that only forwards a call is not a seam.

## 5. Naming and file structure

- A file name states one responsibility. If the body does more, rename it or
  split it.
- A subview or child model with its own factory gets its own file. The parent
  file composes.
- Use one vocabulary across layers: the same concept keeps the same name in
  the controller, model, view, and test.
- Order exports from least to most complex.
- Group by responsibility, not by framework artifact.
- Delete code nothing calls. Delete wrappers that only forward.
- A parent must not know the internal state of its children.

## 6. Failures and outcomes

- Expected failures are typed values. Defects stay defects.
- Represent absence and failure separately. They lead to different user
  messages.
- Do not throw a control-flow side effect from a render path. Return a model
  that describes what the user should see.
- The model set covers the page's real outcomes: ready, empty, not found,
  invalid, unavailable.

## 7. Tests are proof

- Write the test first when a test can exist. Watch it fail for the expected
  reason, then make it pass.
- Test pure factories directly. Test effects through stubbed ports. Render
  views.
- Integration tests must be deterministic and offline. Stub the external
  boundary and drive happy paths and failures from data.
- When two variants share behavior, use one data-driven scenario with a
  variant column.
- Coverage gates are part of the contract. Do not lower them to land a change.
- Run the same checks locally and in CI. Publish a machine-readable report and
  failure artifacts.

## 8. Operational readiness

- One command starts the app. Local configuration comes from a documented file.
- Pin runtime and package-manager versions. Install with a frozen lockfile in
  CI.
- Lint, typecheck, unit tests, build, and browser tests are separate signals.
- CI runs on every push and pull request. A red check blocks the merge.
- Keep failure evidence: coverage reports, screenshots, recordings.

## 9. Documentation

- Use a conventional order: what, why, screenshots, getting started, usage,
  architecture, structure, scripts, testing, configuration, CI.
- Explain why the project exists, what it trades away, and which alternative
  would fit the same principles better.
- Keep copy short. Delete any sentence the reader does not need to act.
- Link these rules so a new contributor can apply them.

## Review checklist

Before calling a change done, ask:

- Does a controller make a decision that belongs in a factory?
- Does a factory take pieces instead of a whole value?
- Does a parent assemble a child instead of calling the child's factory?
- Is absence converted too early?
- Is an exclusive state hidden behind optional fields?
- Are raw literals used for a closed set?
- Is a dependency imported instead of provided?
- Does a file name match its contents?
- Is there a wrapper with no behavior?
- Can the integration suite run with no network?
- Did the same checks pass locally and in CI?
